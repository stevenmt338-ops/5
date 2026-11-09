import React from 'react';
import { HostMood } from '../types/game';
import { Volume2 } from 'lucide-react';
import { gameAudio } from '../utils/audioSystem';

interface VirtualHostProps {
  dialogue: string;
  mood: HostMood;
  voiceEnabled: boolean;
}

export const VirtualHost: React.FC<VirtualHostProps> = ({
  dialogue,
  mood,
  voiceEnabled,
}) => {
  const handlePlayVoice = () => {
    gameAudio.speakArabic(dialogue);
  };

  // ألوان وتأثيرات الحالة المزاجية للمذيع
  const moodBorderColors: Record<HostMood, string> = {
    welcome: 'border-cyan-500/60 shadow-cyan-500/20',
    suspense: 'border-amber-500/70 shadow-amber-500/30',
    thinking: 'border-indigo-500/60 shadow-indigo-500/20',
    celebrating: 'border-emerald-500/80 shadow-emerald-500/30',
    comforting: 'border-blue-500/60 shadow-blue-500/20',
    warning: 'border-rose-500/70 shadow-rose-500/30',
  };

  const moodBadgeText: Record<HostMood, string> = {
    welcome: 'ترحيب بالمتسابق',
    suspense: 'لحظة الترقب والقرار',
    thinking: 'تحليل وتفكير',
    celebrating: 'إجابة عبقرية صحيحة',
    comforting: 'تحية للمحاولة الجريئة',
    warning: 'منعطف حاسم',
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 transition-all">
      {/* صورة المذيع الافتراضي الذكي "سراج" */}
      <div className="relative shrink-0">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-lg transition-all ${
            moodBorderColors[mood] || moodBorderColors.welcome
          }`}
        >
          <img
            src="/src/assets/images/virtual_host_avatar_1794181278950.jpg"
            alt="المذيع الافتراضي سراج"
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* مؤشر بصري لحالة المذيع */}
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
        </span>
      </div>

      {/* صندوق الحديث التفاعلي للمذيع */}
      <div className="flex-1 w-full flex flex-col gap-1.5 text-right">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base">
              سراج <span className="text-xs text-amber-400 font-normal">| المذيع الافتراضي</span>
            </span>
            <span className="text-xs text-slate-400">· {moodBadgeText[mood]}</span>
          </div>

          {/* زر الاستماع لصوت المذيع */}
          <button
            onClick={handlePlayVoice}
            title="الاستماع للمذيع بالصوت العربي"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">نطق العبارة</span>
          </button>
        </div>

        {/* فقاعة الحديث */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 text-sm sm:text-base leading-relaxed relative">
          <p className="font-medium text-slate-100">
            {dialogue}
          </p>
        </div>
      </div>
    </div>
  );
};
