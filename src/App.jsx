import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Moon, Sun } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [darkMode, setDarkMode] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const modes = {
    work: { duration: 25 * 60, label: '集中時間' },
    shortBreak: { duration: 5 * 60, label: '短い休憩' },
    longBreak: { duration: 15 * 60, label: '長い休憩' }
  };

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  const gradientStyle = darkMode ? {
    background: '#1a1a2e',
    minHeight: '100vh',
    transition: 'all 0.5s ease'
  } : {
    background: '#faf8f3',
    minHeight: '100vh',
    transition: 'all 0.5s ease'
  };

  return (
    <div 
      style={gradientStyle}
      className={darkMode ? 'bg-gray-900 text-white min-h-screen' : 'min-h-screen'}
    >
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-12">
          <h1 className={`text-6xl font-bold drop-shadow-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ⏱️ StudyFlow タイマー
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-4 rounded-full transition-all ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-lg'
            }`}
          >
            {darkMode ? <Sun className="w-7 h-7 text-yellow-400" /> : <Moon className="w-7 h-7 text-gray-700" />}
          </button>
        </div>

        {/* メインコンテナ */}
        <div className={`max-w-7xl mx-auto rounded-3xl shadow-2xl p-12 ${
          darkMode ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-md'
        }`}>
          
          {/* モード選択 */}
          <div className="flex gap-5 mb-12 justify-center">
            {Object.entries(modes).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`px-12 py-5 rounded-xl font-bold transition-all text-2xl ${
                  mode === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 3カラムレイアウト */}
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-8 items-center">
            
            {/* 左カラム */}
            <div className="flex flex-col gap-5">
              <div className="text-center py-12 px-6 rounded-2xl shadow-2xl border-4 border-purple-500" style={{backgroundColor: darkMode ? '#2d2d44' : '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <p className={`text-2xl mb-4 font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  完了したポモドーロ
                </p>
                <p className={`text-9xl font-black ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {completedPomodoros}
                </p>
                <p className="text-6xl mt-4">🍅</p>
              </div>

              <div className="text-center py-10 px-6 rounded-2xl shadow-2xl border-4 border-blue-500" style={{backgroundColor: darkMode ? '#2d2d44' : '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <p className={`text-2xl mb-3 font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  現在のモード
                </p>
                <p className={`text-4xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {modes[mode].label}
                </p>
              </div>
            </div>

            {/* 中央カラム：タイマー */}
            <div className="flex flex-col items-center gap-10">
              <div className="relative">
                <svg className="w-[550px] h-[550px] drop-shadow-2xl" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={darkMode ? '#4a4a5e' : '#e5e7eb'}
                    strokeWidth="14"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    transform="rotate(-90 100 100)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy=".3em"
                    className="font-black"
                    style={{ 
                      fontSize: '70px', 
                      fontWeight: '900',
                      fill: darkMode ? '#ffffff' : '#1f2937'
                    }}
                  >
                    {formatTime(timeLeft)}
                  </text>
                </svg>
              </div>

              {/* ボタン */}
              <div className="flex justify-center gap-12">
                <button
                  onClick={toggleTimer}
                  className="p-10 rounded-full shadow-2xl transition-all hover:scale-110 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isActive ? (
                    <Pause className="w-20 h-20 text-white" />
                  ) : (
                    <Play className="w-20 h-20 text-white" />
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-10 rounded-full shadow-2xl transition-all hover:scale-110 bg-white"
                >
                  <RotateCcw className="w-20 h-20 text-gray-700" />
                </button>
              </div>
            </div>

            {/* 右カラム */}
            <div className="flex flex-col gap-5">
              <div className="text-center py-12 px-6 rounded-2xl shadow-2xl border-4 border-pink-500" style={{backgroundColor: darkMode ? '#2d2d44' : '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <p className={`text-2xl mb-4 font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  進捗率
                </p>
                <p className={`text-9xl font-black ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  {Math.round(progress)}%
                </p>
              </div>

              <div className="text-center py-10 px-6 rounded-2xl shadow-2xl border-4 border-purple-500" style={{backgroundColor: darkMode ? '#2d2d44' : '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <p className={`text-2xl mb-3 font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  残り時間
                </p>
                <p className={`text-5xl font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-12">
          <p className={`text-xl font-semibold drop-shadow ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ポモドーロ・テクニックで集中力を最大化 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
