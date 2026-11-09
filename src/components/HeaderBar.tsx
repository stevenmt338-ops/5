import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Trophy, HelpCircle, RotateCcw } from 'lucide-react';
import { gameAudio } from '../utils/audioSystem';

interface HeaderBarProps {
  onOpenRules: () => void;
  onOpenLeaderboard: () => void;
  onRestartGame: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenRules,
  onOpenLeaderboard,
  onRestartGame,
  soundEnabled,
  setSoundEnabled,
  voiceEnabled,
  setVoiceEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameAudio.setSoundEnabled(next);
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    gameAudio.setVoiceEnabled(next);
  };

  return (
    <header className="w-full border-b border-indigo-950/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
        {/* المنطقة الأولى: اسم العلامة التجارية كعنصر نصي مصقول */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <span className="text-amber-400 font-black text-lg">م</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              من سيربح المليون؟
            </span>
            <span className="text-xs text-amber-400/90 font-medium">النسخة المستقبلية</span>
          </div>
        </div>

        {/* المنطقة الثانية: روابط التنقل والمعلومات كعناصر نصية نظيفة بدون كبسولات */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={onOpenRules}
            className="hover:text-amber-400 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500/80" />
            <span>قواعد المسابقة</span>
          </button>
          
          <button
            onClick={onOpenLeaderboard}
            className="hover:text-amber-400 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500/80" />
            <span>لوحة الأذكياء</span>
          </button>

          <button
            onClick={toggleVoice}
            title={voiceEnabled ? 'كتم صوت المذيع الافتراضي' : 'تفعيل صوت المذيع الافتراضي'}
            className="hover:text-cyan-400 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {voiceEnabled ? (
              <Mic className="w-4 h-4 text-cyan-400" />
            ) : (
              <MicOff className="w-4 h-4 text-slate-500" />
            )}
            <span>صوت المذيع</span>
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
            className="hover:text-cyan-400 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span>المؤثرات</span>
          </button>
        </nav>

        {/* المنطقة الثالثة: الإجراء الأساسي الموجه */}
        <div className="flex items-center gap-3 shrink-0">
          {/* أزرار الصوت للشاشات الصغيرة */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="تبديل الصوت"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenLeaderboard}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="لوحة الشرف"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <button
            onClick={onRestartGame}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>جولة جديدة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
