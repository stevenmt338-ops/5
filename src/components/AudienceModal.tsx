import React from 'react';
import { ARABIC_OPTION_LETTERS, toArabicNumerals } from '../utils/arabicUtils';
import { Users, X } from 'lucide-react';

interface AudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentages: [number, number, number, number];
  hiddenOptions: number[];
}

export const AudienceModal: React.FC<AudienceModalProps> = ({
  isOpen,
  onClose,
  percentages,
  hiddenOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative text-right flex flex-col gap-5">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* العنوان */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">استطلاع رأي جمهور الاستوديو</h3>
            <p className="text-xs text-slate-400">تصويت إلكتروني مباشر لجمهور القاعة</p>
          </div>
        </div>

        {/* الرسم البياني للأعمدة */}
        <div className="grid grid-cols-4 gap-3 h-48 items-end pt-4 pb-2 border-b border-slate-800">
          {percentages.map((pct, idx) => {
            const isEliminated = hiddenOptions.includes(idx);
            const displayPct = isEliminated ? 0 : pct;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                {/* النسبة المئوية بالأرقام العربية */}
                <span className="text-xs font-bold text-amber-300 tabular-nums">
                  {toArabicNumerals(displayPct)}٪
                </span>

                {/* العمود الرأسي */}
                <div className="w-full bg-slate-950 rounded-t-lg h-36 flex items-end p-1 border border-slate-800">
                  <div
                    style={{ height: `${displayPct}%` }}
                    className={`w-full rounded-t transition-all duration-700 ${
                      isEliminated
                        ? 'bg-slate-800'
                        : 'bg-gradient-to-t from-amber-600 to-yellow-400 shadow-md shadow-amber-500/20'
                    }`}
                  ></div>
                </div>

                {/* حرف الخيار */}
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                  {ARABIC_OPTION_LETTERS[idx]}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center">
          تذكر أن رأي الجمهور استرشادي ويمكنك الاعتماد على حدسك وثقافتك الشخصية.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
        >
          العودة لاختيار الإجابة
        </button>
      </div>
    </div>
  );
};
