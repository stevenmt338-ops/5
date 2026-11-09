import React from 'react';
import { LifelineState } from '../types/game';
import { Users, PhoneCall, RefreshCw, Sparkles } from 'lucide-react';

interface LifelinesBarProps {
  lifelines: LifelineState;
  onUseFiftyFifty: () => void;
  onUseAudience: () => void;
  onUseFriend: () => void;
  onUseSwitchQuestion: () => void;
  disabled: boolean;
}

export const LifelinesBar: React.FC<LifelinesBarProps> = ({
  lifelines,
  onUseFiftyFifty,
  onUseAudience,
  onUseFriend,
  onUseSwitchQuestion,
  disabled,
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
      {/* حذف إجابتين ٥٠:٥٠ */}
      <button
        onClick={onUseFiftyFifty}
        disabled={disabled || !lifelines.fiftyFifty}
        title={lifelines.fiftyFifty ? 'وسيلة مساعدة: حذف إجابتين خاطئتين (٥٠:٥٠)' : 'تم استخدام هذه الوسيلة'}
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          lifelines.fiftyFifty && !disabled
            ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 hover:scale-105 shadow-md shadow-cyan-500/10'
            : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed line-through opacity-60'
        }`}
      >
        <div className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-[11px] font-black text-cyan-400">
          ٥٠
        </div>
        <span>حذف إجابتين</span>
      </button>

      {/* استطلاع رأي الجمهور */}
      <button
        onClick={onUseAudience}
        disabled={disabled || !lifelines.audiencePoll}
        title={lifelines.audiencePoll ? 'وسيلة مساعدة: استطلاع رأي جمهور الاستوديو' : 'تم استخدام هذه الوسيلة'}
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          lifelines.audiencePoll && !disabled
            ? 'bg-slate-900/90 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-950/40 hover:scale-105 shadow-md shadow-amber-500/10'
            : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed line-through opacity-60'
        }`}
      >
        <Users className="w-4 h-4 text-amber-400" />
        <span>رأي الجمهور</span>
      </button>

      {/* الاتصال بصديق */}
      <button
        onClick={onUseFriend}
        disabled={disabled || !lifelines.callFriend}
        title={lifelines.callFriend ? 'وسيلة مساعدة: الاتصال بصديق خبير ومحادثته لمدة ٣٠ ثانية' : 'تم استخدام هذه الوسيلة'}
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          lifelines.callFriend && !disabled
            ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40 hover:scale-105 shadow-md shadow-emerald-500/10'
            : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed line-through opacity-60'
        }`}
      >
        <PhoneCall className="w-4 h-4 text-emerald-400" />
        <span>اتصال بصديق</span>
      </button>

      {/* استبدال السؤال */}
      <button
        onClick={onUseSwitchQuestion}
        disabled={disabled || !lifelines.switchQuestion}
        title={lifelines.switchQuestion ? 'وسيلة مساعدة: تغيير السؤال الحالي بسؤال جديد بنفس القيمة' : 'تم استخدام هذه الوسيلة'}
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          lifelines.switchQuestion && !disabled
            ? 'bg-slate-900/90 border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-950/40 hover:scale-105 shadow-md shadow-purple-500/10'
            : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed line-through opacity-60'
        }`}
      >
        <RefreshCw className="w-4 h-4 text-purple-400" />
        <span>تغيير السؤال</span>
      </button>
    </div>
  );
};
