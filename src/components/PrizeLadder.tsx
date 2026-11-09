import React from 'react';
import { PRIZE_LADDER, getGuaranteedPrize } from '../types/game';
import { toArabicNumerals, formatEgyptianPound, formatPoundShort } from '../utils/arabicUtils';
import { ShieldCheck, Award } from 'lucide-react';

interface PrizeLadderProps {
  currentLevel: number; // 1 to 15
  isGameOver?: boolean;
}

export const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentLevel }) => {
  const guaranteedPrize = getGuaranteedPrize(currentLevel);

  return (
    <aside className="w-full lg:w-72 bg-slate-900/90 border border-indigo-950/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3">
      {/* رأس لوحة الجوائز */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>سلم الجوائز المالية</span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>المضمون:</span>
          <span className="font-semibold text-emerald-400 tabular-nums">
            {formatPoundShort(guaranteedPrize)}
          </span>
        </div>
      </div>

      {/* سلم الأسئلة من ١٥ إلى ١ */}
      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[520px] pr-1">
        {PRIZE_LADDER.map((step) => {
          const isCurrent = step.level === currentLevel;
          const isPassed = step.level < currentLevel;
          const isUpcoming = step.level > currentLevel;

          let containerClass = 'flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all font-medium';

          if (isCurrent) {
            // السؤال النشط الحالي
            containerClass += ' bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/10 scale-[1.02]';
          } else if (isPassed) {
            // أسئلة تم تجاوزها بنجاح
            containerClass += ' bg-emerald-950/30 border border-emerald-900/40 text-emerald-400/90';
          } else {
            // أسئلة قادمة
            if (step.isMilestone) {
              containerClass += ' bg-indigo-950/40 border border-amber-500/30 text-amber-200/90';
            } else {
              containerClass += ' text-slate-400 hover:text-slate-300 border border-transparent';
            }
          }

          return (
            <div key={step.level} className={containerClass}>
              {/* رقم السؤال بالأرقام العربية الشرقية */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 text-center tabular-nums font-bold ${
                    isCurrent
                      ? 'text-amber-300'
                      : step.isMilestone
                      ? 'text-amber-400'
                      : isPassed
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {toArabicNumerals(step.level)}
                </span>
                {step.isMilestone && (
                  <span
                    title={step.level === 15 ? 'جائزة المليون الكبرى' : 'محطة أمان مضمونة'}
                    className={`text-[10px] ${
                      step.level === 15 ? 'text-amber-300 font-black' : 'text-emerald-400/80'
                    }`}
                  >
                    {step.level === 15 ? '★' : '◆'}
                  </span>
                )}
              </div>

              {/* قيمة الجائزة بالجنيه المصري */}
              <span
                className={`tabular-nums tracking-wide ${
                  isCurrent
                    ? 'text-amber-200 font-bold'
                    : step.isMilestone
                    ? 'text-amber-400 font-semibold'
                    : isPassed
                    ? 'text-emerald-400/80'
                    : 'text-slate-300'
                }`}
              >
                {formatEgyptianPound(step.prize)}
              </span>
            </div>
          );
        })}
      </div>

      {/* تذييل سلم الجوائز مع شرح محطات الأمان */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">◆</span>
          <span>محطات الأمان: ٥ و ١٠</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-amber-300">★</span>
          <span>المليون: ١٥</span>
        </span>
      </div>
    </aside>
  );
};
