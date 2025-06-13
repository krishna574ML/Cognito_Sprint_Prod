import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sun, Moon, Zap, Coffee, Check, Wind, Sparkles, Brain, Bot } from 'lucide-react';

// Tone.js for subtle, motivating sounds
// This will be loaded from a CDN in the main HTML file.
// For this component, we assume `Tone` is available on the window object.
// In your index.html, add: <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

const MOCK_QUOTES = {
  focus: [
    "Discipline is the bridge between goals and accomplishment.",
    "The amateur waits for inspiration. The pro gets to work.",
    "Deep work builds empires. Stay in the zone."
  ],
  break: [
    "Rest is not idleness. It's an investment in your focus.",
    "The bow that is always bent will soon break.",
    "Almost everything will work again if you unplug it for a few minutes, including you."
  ]
};

const INITIAL_TASKS = [
    { id: 1, text: 'Train v1 classification model', priority: 'High', pomodoros: 0, completed: false },
    { id: 2, text: 'Document data preprocessing pipeline', priority: 'Medium', pomodoros: 1, completed: true },
    { id: 3, text: 'EDA for new user segmentation data', priority: 'High', pomodoros: 0, completed: false },
    { id: 4, text: 'Refactor data ingestion script for efficiency', priority: 'Low', pomodoros: 0, completed: false },
];

const PriorityIndicator = ({ priority }) => {
    const styles = {
        High: { icon: <Zap className="w-4 h-4 text-red-400" />, text: "High Priority", color: "text-red-400" },
        Medium: { icon: <Sparkles className="w-4 h-4 text-yellow-400" />, text: "Medium Priority", color: "text-yellow-400" },
        Low: { icon: <Wind className="w-4 h-4 text-blue-400" />, text: "Low Priority", color: "text-blue-400" },
    };
    const { icon, text, color } = styles[priority] || styles.Low;
    return <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>{icon}{text}</div>
};

// Main Component
export function DailyGoals() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [quote, setQuote] = useState(MOCK_QUOTES.focus[0]);
  const [streak, setStreak] = useState(3);
  
  // Timer State
  const [time, setTime] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [currentTaskId, setCurrentTaskId] = useState(null);
  
  // UI State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDayCompleteModal, setShowDayCompleteModal] = useState(false);

  // Sound Engine
  const synth = useMemo(() => {
    // Check if Tone is available (it should be loaded via CDN)
    if (typeof window.Tone !== 'undefined') {
        return new window.Tone.Synth().toDestination();
    }
    return null;
  }, []);

  const playSound = useCallback((note, duration) => {
    if (synth) {
      synth.triggerAttackRelease(note, duration);
    }
  }, [synth]);

  // Core Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (isActive && time === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        // Focus session ends
        playSound("C5", "8n");
        setTasks(prevTasks => prevTasks.map(t => t.id === currentTaskId ? { ...t, pomodoros: t.pomodoros + 1 } : t));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        setMode('break');
        setTime(BREAK_DURATION);
        setQuote(MOCK_QUOTES.break[Math.floor(Math.random() * MOCK_QUOTES.break.length)]);
      } else {
        // Break session ends
        playSound("G4", "8n");
        resetTimer();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, mode, currentTaskId, playSound]);

  // Check for day completion
  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    if (completedTasks >= 3) {
      setShowDayCompleteModal(true);
    }
  }, [tasks]);

  const startFocus = (taskId) => {
    playSound("C4", "8n");
    setCurrentTaskId(taskId);
    setMode('focus');
    setTime(FOCUS_DURATION);
    setIsActive(true);
    setQuote(MOCK_QUOTES.focus[Math.floor(Math.random() * MOCK_QUOTES.focus.length)]);
  };

  const togglePause = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setCurrentTaskId(null);
    setMode('focus');
    setTime(FOCUS_DURATION);
    setQuote(MOCK_QUOTES.focus[Math.floor(Math.random() * MOCK_QUOTES.focus.length)]);
  };
  
  const skipToBreak = () => {
      playSound("E4", "8n");
      setMode('break');
      setTime(BREAK_DURATION);
      setIsActive(true);
      setQuote(MOCK_QUOTES.break[Math.floor(Math.random() * MOCK_QUOTES.break.length)]);
  };

  const completeTask = (taskId) => {
    playSound("A5", "16n");
    if(navigator.vibrate) navigator.vibrate(100);
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, completed: true, swiped: true } : t));
  };
  
  const timerProgress = mode === 'focus' 
    ? ((FOCUS_DURATION - time) / FOCUS_DURATION) * 100 
    : ((BREAK_DURATION - time) / BREAK_DURATION) * 100;

  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const activeTaskText = currentTaskId ? tasks.find(t => t.id === currentTaskId)?.text : "Idle";
  const focusMood = isActive ? (mode === 'focus' ? '⚡️ Deep Mode' : '🧘‍♂️ Zen Break') : 'Ready';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
       <style>{`
        .font-satoshi { font-family: 'Satoshi', sans-serif; } /* Ensure you load this font */
        .timer-ring-circle { transition: stroke-dashoffset 1s linear; }
        .task-card { transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1); }
        .task-card.swiped { transform: translateX(100%) scale(0.8); opacity: 0; }
        .confetti { position: absolute; width: 10px; height: 10px; background: #fff; top: 50%; left: 50%; opacity: 0; animation: confetti-anim 1s ease-out forwards; }
        @keyframes confetti-anim {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <div className="font-sans bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 min-h-screen p-6 md:p-8 selection:bg-purple-500/30">

        {showConfetti && Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="confetti" style={{ 
              background: `hsl(${Math.random() * 360}, 70%, 50%)`,
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.2}s` 
            }}></div>
        ))}
        
        {/* --- FLOATING FOCUS WIDGET --- */}
        <div className="sticky top-6 z-30 bg-white/50 dark:bg-[#161b22]/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 dark:border-[#30363d] flex items-center justify-between p-3 md:p-4">
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle className="text-black/5 dark:text-white/5" strokeWidth="3" fill="none" cx="18" cy="18" r="15.9155" />
                        <circle className={`timer-ring-circle ${mode === 'focus' ? 'text-purple-500' : 'text-green-400'}`} strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset={100 - timerProgress} strokeLinecap="round" fill="none" cx="18" cy="18" r="15.9155" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-400">
                        {isActive ? (mode === 'focus' ? <Zap/> : <Coffee/>) : <Play/>}
                    </div>
                </div>
                <div>
                    <p className="font-bold text-xl md:text-2xl tracking-tighter">{formatTime(time)}</p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">{focusMood}</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
                <button onClick={togglePause} className="p-2 md:p-3 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"><Pause size={16}/></button>
                <button onClick={skipToBreak} className="p-2 md:p-3 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"><SkipForward size={16}/></button>
                <button onClick={resetTimer} className="p-2 md:p-3 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"><RotateCcw size={16}/></button>
            </div>
        </div>
        
        {/* --- HEADER & QUOTE --- */}
        <header className="my-8 md:my-10 flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold">{quote} <span className="text-yellow-400 ml-2">— Day {streak} Streak 🔥</span></h1>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
        </header>

        {/* --- AGENDA STACK --- */}
        <main>
             <div className="space-y-3">
            {tasks.filter(t => !t.completed).map(task => (
              <div key={task.id} className={`task-card bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-4 flex items-center gap-4 shadow-md ${task.swiped ? 'swiped' : ''} ${currentTaskId === task.id ? 'ring-2 ring-purple-500' : ''}`}>
                 <div className="relative w-12 h-12 flex-shrink-0">
                     <svg className="w-full h-full text-gray-200 dark:text-gray-700" viewBox="0 0 36 36"><circle strokeWidth="3" fill="none" cx="18" cy="18" r="15.9155" /></svg>
                     <p className="absolute inset-0 flex items-center justify-center text-xs font-bold">{task.pomodoros}</p>
                 </div>

                <div className="flex-grow">
                    <p className="font-semibold text-base">{task.text}</p>
                    <PriorityIndicator priority={task.priority} />
                </div>
                <button onClick={() => completeTask(task.id)} className="p-3 bg-green-400/10 text-green-500 rounded-lg hover:bg-green-400/20"><Check size={20}/></button>
                <button onClick={() => startFocus(task.id)} className="p-3 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20"><Play size={20}/></button>
              </div>
            ))}
            </div>
            
            {tasks.filter(t=>t.completed).length > 0 && (
                 <div className="mt-8">
                     <h2 className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-2">Completed Today ✅</h2>
                     <div className="space-y-2">
                        {tasks.filter(t => t.completed).map(task => (
                             <div key={task.id} className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-sm text-gray-500 dark:text-gray-400 line-through">
                                 {task.text}
                             </div>
                         ))}
                     </div>
                 </div>
            )}
        </main>

        {/* --- End of Day Modal --- */}
        {showDayCompleteModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={()=>setShowDayCompleteModal(false)}>
                <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] p-10 rounded-2xl shadow-2xl text-center max-w-sm">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-white">You Crushed It!</h3>
                    <p className="text-gray-400 mt-2">Amazing work today. You've completed {tasks.filter(t => t.completed).length} core tasks. Time to recharge.</p>
                    <button onClick={() => setShowDayCompleteModal(false)} className="mt-8 w-full py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20">Close</button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
