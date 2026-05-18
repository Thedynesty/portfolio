/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  MessageSquare, 
  Cpu, 
  Users, 
  Gamepad2, 
  Zap, 
  Music, 
  Pause, 
  Play, 
  ExternalLink, 
  Instagram, 
  Linkedin, 
  Github,
  Globe,
  Settings,
  ShieldCheck,
  ChevronRight,
  Trophy,
  Award,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Theme = 'cyan' | 'crimson';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AchievementToast extends Achievement {
  toastId: string;
  isHiding: boolean;
}

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// --- Components ---

const CyberBackground: React.FC<{ theme: Theme }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: any[] = [];
    let particles: any[] = [];
    let animationFrameId: number;

    const accentColor = theme === 'cyan' ? '#22d3ee' : '#ff003c';
    const accentGlow = theme === 'cyan' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 0, 60, 0.4)';

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const density = (width * height) / 15000;
      for (let i = 0; i < density; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.01 + Math.random() * 0.02,
          glowRings: [] as any[]
        });
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      // Node connections (Circuit traces)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // Update position (Drifting)
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        // Wrap around
        if (nodeA.x < 0) nodeA.x = width;
        if (nodeA.x > width) nodeA.x = 0;
        if (nodeA.y < 0) nodeA.y = height;
        if (nodeA.y > height) nodeA.y = 0;

        // Pulse logic
        nodeA.phase += nodeA.phaseSpeed;
        const opacity = 0.4 + Math.sin(nodeA.phase) * 0.4;
        
        // Draw glow propagation ring if at peak
        if (Math.sin(nodeA.phase) > 0.98 && Math.random() > 0.95) {
          nodeA.glowRings.push({ r: 2, o: 0.8 });
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distSq = dx * dx + dy * dy;
          const limit = 180;
          
          if (distSq < limit * limit) {
            const dist = Math.sqrt(distSq);
            const edgeOpacity = (1 - dist / limit) * 0.2;
            ctx.strokeStyle = theme === 'cyan' ? `rgba(34, 211, 238, ${edgeOpacity})` : `rgba(255, 0, 60, ${edgeOpacity})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();

            // Data particles logic
            if (Math.random() > 0.9995) {
              particles.push({
                x: nodeA.x,
                y: nodeA.y,
                tx: nodeB.x,
                ty: nodeB.y,
                p: 0,
                s: 0.005 + Math.random() * 0.01
              });
            }
          }
        }

        // Draw node
        ctx.fillStyle = theme === 'cyan' ? `rgba(34, 211, 238, ${opacity})` : `rgba(255, 0, 60, ${opacity})`;
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = accentColor;
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw glow rings
        nodeA.glowRings = nodeA.glowRings.filter((r: any) => r.o > 0.01);
        nodeA.glowRings.forEach((ring: any) => {
          ctx.strokeStyle = theme === 'cyan' ? `rgba(34, 211, 238, ${ring.o})` : `rgba(255, 0, 60, ${ring.o})`;
          ctx.beginPath();
          ctx.arc(nodeA.x, nodeA.y, ring.r, 0, Math.PI * 2);
          ctx.stroke();
          ring.r += 0.8;
          ring.o -= 0.02;
        });
      }

      // Draw particles
      particles = particles.filter(p => p.p < 1);
      particles.forEach(p => {
        p.p += p.s;
        const curX = p.x + (p.tx - p.x) * p.p;
        const curY = p.y + (p.ty - p.y) * p.p;
        
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = accentColor;
        ctx.beginPath();
        ctx.arc(curX, curY, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-40 md:opacity-70">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`reveal ${isVisible ? 'active' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AudioWaveform: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className={`flex items-end gap-[3px] h-6 px-2 ${isPlaying ? 'waveform-active' : ''}`}>
      <div className="waveform-bar h-1" />
      <div className="waveform-bar h-1" />
      <div className="waveform-bar h-1" />
      <div className="waveform-bar h-1" />
      <div className="waveform-bar h-1" />
    </div>
  );
};

const MusicPlayer: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const tracks = {
    cyan: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // Ambient Chill
    crimson: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Energetic Synth
  };

  useEffect(() => {
    // Autoplay attempt
    const attemptPlay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Autoplay blocked, waiting for interaction...");
          });
      }
    };

    attemptPlay();

    // Interaction fallback
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current && !isPlaying) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.error("Interaction play failed", e));
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = tracks[theme];
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log("Theme switch play failed", e));
      }
    }
  }, [theme]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Manual play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
      <button 
        onClick={toggleMusic}
        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>
      
      <div className="flex items-center gap-2">
        <AudioWaveform isPlaying={isPlaying} />
        <span className="text-[9px] font-mono tracking-widest uppercase opacity-40 hidden sm:inline">
          {isPlaying ? 'Live Stream' : 'Idle'}
        </span>
      </div>
      
      <audio ref={audioRef} loop />
    </div>
  );
};

const NetworkRepairGame: React.FC<{ theme: Theme; onAchievement: (id: string) => void }> = ({ theme, onAchievement }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('dh_highscore') || 0));
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<{ msg: string; success: boolean } | null>(null);
  
  const gameStateRef = useRef({
    isPlaying: false,
    score: 0,
    activeCell: null as number | null
  });
  
  const timerRef = useRef<any>(null);
  const spawnRef = useRef<any>(null);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearTimeout(spawnRef.current);
    timerRef.current = null;
    spawnRef.current = null;
  };

  const spawnBug = () => {
    if (!gameStateRef.current.isPlaying) return;
    
    setActiveCell(prev => {
      let next;
      do {
        next = Math.floor(Math.random() * 9);
      } while (next === prev);
      gameStateRef.current.activeCell = next;
      return next;
    });

    const currentScore = gameStateRef.current.score;
    // Ramping difficulty: faster as score increases, floor at 350ms
    const newDelay = Math.max(350, 950 - (currentScore * 38));
    
    if (spawnRef.current) clearTimeout(spawnRef.current);
    spawnRef.current = setTimeout(spawnBug, newDelay);
  };

  const startGame = () => {
    if (isPlaying) return; // Prevent multiple starts

    cleanup();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameResult(null);
    setActiveCell(null);
    
    gameStateRef.current = {
      isPlaying: true,
      score: 0,
      activeCell: null
    };

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnRef.current = setTimeout(spawnBug, 600);
  };

  const endGame = () => {
    const finalScore = gameStateRef.current.score;
    setIsPlaying(false);
    gameStateRef.current.isPlaying = false;
    cleanup();
    setActiveCell(null);
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('dh_highscore', finalScore.toString());
    }
    
    if (finalScore >= 15) {
      setGameResult({ msg: "Network Optimized! You're a certified Server Administrator.", success: true });
      onAchievement('game_win');
    } else {
      setGameResult({ msg: "System Overload. Target bandwidth not achieved. Try again to stabilize.", success: false });
    }
  };

  const handleSmash = (index: number) => {
    if (!isPlaying || index !== activeCell) return;
    
    setScore(prev => {
      const next = prev + 1;
      gameStateRef.current.score = next;
      return next;
    });
    
    setActiveCell(null);
    gameStateRef.current.activeCell = null;
    
    if (spawnRef.current) clearTimeout(spawnRef.current);
    spawnRef.current = setTimeout(spawnBug, 100);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <section className="mb-32 max-w-4xl mx-auto px-6 relative">
      <RevealOnScroll>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-300">
          
          {/* Header Stats */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
            <div>
              <h2 className="text-4xl font-display font-black tracking-tight mb-2 uppercase italic">Bug Smasher v2.0</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
                <p className="text-text-secondary text-[10px] font-mono uppercase tracking-[0.3em]">
                  Latent Packet Optimization
                </p>
              </div>
            </div>
            
            <div className="flex gap-10">
              <div className="text-center group">
                <div className="text-[10px] uppercase font-mono opacity-40 mb-1 font-bold">Packets</div>
                <div className={`text-3xl font-display font-black ${score >= 15 ? 'text-green-400' : 'text-accent'}`}>{score}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase font-mono opacity-40 mb-1 font-bold">Uptime</div>
                <div className="text-3xl font-display font-black">{timeLeft}s</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase font-mono opacity-40 mb-1 font-bold text-accent">Record</div>
                <div className="text-3xl font-display font-black text-accent shadow-accent">{highScore}</div>
              </div>
            </div>
          </div>

          {/* Grid Engine */}
          <div className="relative aspect-square md:aspect-video bg-black/60 rounded-2xl border border-white/10 p-4 md:p-8 overflow-hidden">
            {!isPlaying && !gameResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-8 text-center backdrop-blur-md">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-6 shadow-accent/20 shadow-2xl">
                  <Gamepad2 size={40} />
                </div>
                <h3 className="text-2xl font-display font-black mb-4 uppercase tracking-tighter">Initialize Interface</h3>
                <p className="text-text-secondary text-sm mb-8 max-w-xs leading-relaxed font-medium">Neutralize 15 glitches in 30 seconds to optimize the environment.</p>
                <button 
                  onClick={startGame}
                  className="group relative bg-accent text-black px-12 py-4 rounded-full font-black tracking-tighter hover:scale-105 transition-all shadow-accent"
                >
                  START OPTIMIZATION
                </button>
              </div>
            )}

            {gameResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-8 text-center backdrop-blur-lg">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${gameResult.success ? 'bg-accent/20 text-accent shadow-accent' : 'bg-red-500/10 text-red-500 shadow-red-500/20'}`}>
                    {gameResult.success ? <ShieldCheck size={44} /> : <Zap size={44} />}
                </div>
                <h3 className="text-3xl font-display font-black mb-4 uppercase tracking-tighter">{gameResult.success ? 'System Stable' : 'Optimization Failed'}</h3>
                <p className="text-text-secondary text-lg mb-10 max-w-sm leading-relaxed font-medium tracking-tight leading-relaxed">{gameResult.msg}</p>
                <button 
                  onClick={startGame}
                  className="bg-accent text-black px-12 py-4 rounded-full font-black tracking-tighter hover:scale-105 transition-transform shadow-accent"
                >
                  RETRY PROTOCOL
                </button>
              </div>
            )}

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-3 md:gap-6 h-full w-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  disabled={!isPlaying}
                  onPointerDown={() => handleSmash(i)}
                  className={`
                    relative rounded-xl border border-white/5 transition-all duration-150 overflow-hidden
                    ${isPlaying ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                    ${activeCell === i ? 'border-accent bg-accent/10 shadow-accent' : 'bg-white/5'}
                  `}
                >
                  <AnimatePresence>
                    {activeCell === i && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl select-none pointer-events-none"
                      >
                        👾
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white" />
                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-text-secondary uppercase tracking-[0.4em] gap-4">
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-accent" />
              <span>CORE_LOGIC: GRID_MAPPING_V3</span>
            </div>
            <div className="flex items-center gap-4">
              <span>ACCURACY: {score > 0 ? 'HIGH' : 'WAITING'}</span>
              <span className="text-accent">CONNECTED</span>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('cyan');
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dh_achievements') || '[]');
    } catch {
      return [];
    }
  });
  const [activeToasts, setActiveToasts] = useState<AchievementToast[]>([]);

  const achievements: Record<string, Achievement> = {
    theme_switch: {
      id: 'theme_switch',
      title: 'NETWORK PHASE SHIFT',
      description: 'First theme toggle detected.',
      icon: <Zap size={20} />
    },
    game_win: {
      id: 'game_win',
      title: 'ROOT ACCESS GRANTED',
      description: 'Stabilized the network core.',
      icon: <Trophy size={20} />
    },
    social_click: {
      id: 'social_click',
      title: 'CONNECTED TO THE NODE',
      description: 'External link established.',
      icon: <Link size={20} />
    }
  };

  useEffect(() => {
    document.body.className = theme === 'crimson' ? 'crimson-theme' : '';
  }, [theme]);

  const unlockAchievement = (id: string) => {
    if (unlockedAchievements.includes(id)) return;
    
    const achievement = achievements[id];
    if (!achievement) return;

    const newUnlocked = [...unlockedAchievements, id];
    setUnlockedAchievements(newUnlocked);
    localStorage.setItem('dh_achievements', JSON.stringify(newUnlocked));

    const toastId = Math.random().toString(36).substr(2, 9);
    const newToast: AchievementToast = { ...achievement, toastId, isHiding: false };
    
    setActiveToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setActiveToasts(prev => prev.map(t => t.toastId === toastId ? { ...t, isHiding: true } : t));
      setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.toastId !== toastId));
      }, 500);
    }, 5000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'cyan' ? 'crimson' : 'cyan');
    unlockAchievement('theme_switch');
  };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-black">
      {/* Background elements */}
      <CyberBackground theme={theme} />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 px-6 safe-padding-top grid grid-cols-3 items-center bg-transparent backdrop-blur-sm border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 justify-self-start"
        >
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-black">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="font-display font-bold tracking-tighter text-xl text-accent">ADW.2026</span>
        </motion.div>

        {/* Audio Player in Center Cluster */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="justify-self-center"
        >
          <MusicPlayer theme={theme} />
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={toggleTheme}
          className="group flex items-center gap-3 bg-white/5 hover:bg-accent border border-white/10 hover:border-accent p-1.5 pl-4 rounded-full transition-all duration-300 overflow-hidden justify-self-end text-right min-h-[44px]"
        >
          <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] group-hover:text-black transition-colors">
            {theme === 'cyan' ? 'Slate' : 'Crimson'} Mode
          </span>
          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-black/20 flex items-center justify-center group-hover:text-black transition-colors shrink-0">
            {theme === 'cyan' ? <Monitor size={14} /> : <Zap size={14} />}
          </div>
        </motion.button>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <section className="mb-32">
          <RevealOnScroll>
            <div className="max-w-4xl">
              <h4 className="interactive-title text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-12 h-[1px] bg-accent"></span>
                PORTFOLIO
              </h4>
              <h1 className="interactive-title text-6xl md:text-8xl font-display font-black tracking-tight leading-[0.9] mb-8">
                ARCHITECTING <br />
                <span className="gradient-text">DIGITAL WORLDS</span>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mb-10 font-medium">
                Technical server developer and community administrator specializing in building, optimizing, and managing complex digital environments.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#work" className="bg-accent text-black px-8 py-4 rounded-sm font-bold tracking-tight hover:scale-105 transition-transform shadow-accent">
                  VIEW OPERATIONS
                </a>
                <a href="#connect" className="border border-white/20 hover:border-accent px-8 py-4 rounded-sm font-bold tracking-tight transition-colors">
                  SECURE CONTACT
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* Feature Sections */}
        <div id="work" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <RevealOnScroll delay={100}>
            <div className="card-hover p-8 rounded-xl bg-white/5 backdrop-blur-md group">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-black transition-colors">
                <Gamepad2 size={24} />
              </div>
              <h3 className="interactive-title text-2xl font-display font-bold mb-4">Minecraft Server Development</h3>
              <ul className="space-y-4 text-text-secondary font-medium">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Server Optimization:</strong> Configuring Purpur & Velocity for absolute low-latency performance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Feature Integration:</strong> Structural optimization, world management, performance tuning, and plugin infrastructure configurations (WorldGuard, Multiverse).</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Economic Infrastructure:</strong> Designing reward systems and player retention cycles.</span>
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="card-hover p-8 rounded-xl bg-white/5 backdrop-blur-md group">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-black transition-colors">
                <MessageSquare size={24} />
              </div>
              <h3 className="interactive-title text-2xl font-display font-bold mb-4">Discord Administration</h3>
              <ul className="space-y-4 text-text-secondary font-medium">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Community Architecture:</strong> Structured environments with logical channel hierarchies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Permission Scaling:</strong> Robust security models and foolproof moderation roles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-1 text-accent" />
                  <span><strong className="text-text-primary">Advanced Automation:</strong> Custom bot integration for seamless user engagement.</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-white/5">
                <a 
                  href="https://discord.com/users/841673747290914827" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent font-mono text-sm tracking-widest hover:underline"
                >
                  LINK DIRECT ACCESS <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Skills Section */}
        <section className="mb-32">
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="interactive-title text-4xl font-display font-black tracking-tight mb-4">CORE DIRECTORY</h2>
              <div className="w-20 h-1 bg-accent"></div>
            </div>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Server Management", icon: <Cpu />, items: ["Purpur", "Velocity", "Spigot", "Troubleshooting"] },
              { title: "Community Ops", icon: <MessageSquare />, items: ["Discord Moderation", "Bot Flow", "Permissions"] },
              { title: "Visual Branding", icon: <Monitor />, items: ["Graphic Layouts", "Branding", "Creative Study"] },
            ].map((skill, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className="p-6 border border-white/5 bg-white/5 rounded-lg hover:border-accent transition-colors">
                  <div className="text-accent mb-4">{skill.icon}</div>
                  <h4 className="font-display font-bold text-lg mb-4">{skill.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, j) => (
                      <span key={j} className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded-sm uppercase tracking-wider">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Network Repair Game */}
        <NetworkRepairGame theme={theme} onAchievement={unlockAchievement} />

        {/* Connect Section */}
        <section id="connect" className="mb-32">
          <RevealOnScroll>
            <div className="mb-12 text-center">
              <h2 className="interactive-title text-5xl font-display font-black tracking-tight mb-4 uppercase">Establish Connection</h2>
              <p className="text-text-secondary max-w-xl mx-auto font-medium">Available for technical consultation and digital environment architecture in 2026.</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <RevealOnScroll delay={100}>
              <a 
                href="https://discord.com/users/841673747290914827" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => unlockAchievement('social_click')}
                className="card-hover flex items-center justify-between p-6 bg-[#5865F2]/10 rounded-xl group overflow-hidden relative"
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="group-hover:text-[#5865F2] transition-colors" />
                  <span className="font-display font-bold">DISCORD</span>
                </div>
                <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#5865F2]/20 blur-2xl rounded-full translate-x-8 -translate-y-8" />
              </a>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <a 
                href="#" 
                onClick={() => unlockAchievement('social_click')}
                className="card-hover flex items-center justify-between p-6 bg-[#E4405F]/10 rounded-xl group overflow-hidden relative"
              >
                <div className="flex items-center gap-4">
                  <Instagram className="group-hover:text-[#E4405F] transition-colors" />
                  <span className="font-display font-bold">INSTAGRAM</span>
                </div>
                <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#E4405F]/20 blur-2xl rounded-full translate-x-8 -translate-y-8" />
              </a>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <a 
                href="#" 
                onClick={() => unlockAchievement('social_click')}
                className="card-hover flex items-center justify-between p-6 bg-[#0077B5]/10 rounded-xl group overflow-hidden relative"
              >
                <div className="flex items-center gap-4">
                  <Linkedin className="group-hover:text-[#0077B5] transition-colors" />
                  <span className="font-display font-bold">LINKEDIN</span>
                </div>
                <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#0077B5]/20 blur-2xl rounded-full translate-x-8 -translate-y-8" />
              </a>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 safe-padding-bottom border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20">
        <div className="text-[10px] font-mono tracking-[0.2em] text-text-secondary uppercase">
          © 2026 - Architecting Digital Worlds
        </div>
        <div className="flex gap-8 text-[10px] font-mono tracking-[0.2em] text-text-secondary uppercase">
          <a href="#" className="hover:text-accent transition-colors">Operations</a>
          <a href="#" className="hover:text-accent transition-colors">Directory</a>
          <a href="#" className="hover:text-accent transition-colors">Privacy</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent shadow-accent animate-pulse" />
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Active System 2026</span>
        </div>
      </footer>

      {/* Persistence Elements */}
      
      {/* Scroll indicator for cyber-crimson theme */}
      <AnimatePresence>
        {theme === 'crimson' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-1 bg-accent z-50 shadow-accent transition-all duration-300"
            style={{ width: '0%' }}
          />
        )}
      </AnimatePresence>

      {/* Achievement Notifications UI */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none overflow-hidden max-w-[90vw] sm:max-w-md">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <div 
              key={toast.toastId}
              className={`achievement-toast p-4 rounded-sm flex items-center gap-4 ${toast.isHiding ? 'hiding' : ''}`}
            >
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-accent achievement-icon-glow shrink-0">
                {toast.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={10} className="text-accent" />
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.2em]">Achievement Unlocked</span>
                </div>
                <h4 className="text-sm font-display font-black tracking-tight uppercase truncate">{toast.title}</h4>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{toast.description}</p>
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
