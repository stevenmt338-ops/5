import React, { useState } from 'react';
import { formatEgyptianPound, toArabicNumerals } from '../utils/arabicUtils';
import { RotateCcw, Award, Trophy, CheckCircle2 } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onSaveScore: (name: string) => void;
  prizeWon: number;
  questionsAnswered: number;
  timeSpentSeconds: number;
  reason: 'wrong_answer' | 'withdrawn';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRestart,
  onSaveScore,
  prizeWon,
  questionsAnswered,
  timeSpentSeconds,
  reason,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || hasSaved) return;
    onSaveScore(playerName.trim());
    setHasSaved(true);
  };

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center flex flex-col items-center gap-5 my-auto">
        {/* شارة النتيجة */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-900 to-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
          <Award className="w-8 h-8" />
        </div>

        {/* النصوص الرئيسية */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {reason === 'withdrawn' ? 'انسحاب حكيم وموفق!' : 'انتهت المحاولة! تحية لشجاعتك'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {reason === 'withdrawn'
              ? 'فضلت الحفاظ على أرباحك وتجنب المخاطرة، قرار مدروس!'
              : 'حظاً أوفر في المرة القادمة، لقد خضت تحدياً فكرياً ممتعاً!'}
          </p>
        </div>

        {/* عرض المبلغ النهائي بالجنيه المصري */}
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1">
          <span className="text-xs text-slate-400">إجمالي المبلغ الذي تغادر به:</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
            {formatEgyptianPound(prizeWon)}
          </span>
        </div>

        {/* بطاقة الإحصائيات */}
        <div className="w-full grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">الأسئلة الصحيحة:</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              {toArabicNumerals(questionsAnswered)} من ١٥
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">الوقت المستغرق:</span>
            <span className="text-sm font-bold text-cyan-300 tabular-nums">
              {toArabicNumerals(minutes)} دقيقة و {toArabicNumerals(seconds)} ثانية
            </span>
          </div>
        </div>

        {/* حفظ النتيجة في لوحة الشرف إذا كان هناك رصيد */}
        {prizeWon > 0 && (
          !hasSaved ? (
            <form onSubmit={handleSave} className="w-full flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 text-right">
                سجل نتيجتك في قائمة الأذكياء:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="اسم المتسابق..."
                  required
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 text-right"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>حفظ</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full py-2 px-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تم حفظ نتيجتك بنجاح!</span>
            </div>
          )
        )}

        {/* زر إعادة اللعب الفوري */}
        <button
          onClick={onRestart}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-amber-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>محاولة جديدة للوصول إلى المليون</span>
        </button>
      </div>
    </div>
  );
};
