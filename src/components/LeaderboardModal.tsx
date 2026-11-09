import React from 'react';
import { LeaderboardEntry } from '../types/game';
import { formatEgyptianPound, toArabicNumerals } from '../utils/arabicUtils';
import { Trophy, X, Trash2, Award } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClearLeaderboard: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClearLeaderboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative text-right flex flex-col gap-5 max-h-[90vh]">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">لوحة شرف الأذكياء</h3>
            <p className="text-xs text-slate-400">سجل أفضل المتسابقين والجوائز المحققة بالجنيه المصري</p>
          </div>
        </div>

        {/* جدول أو قائمة المتصدرين */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-2">
              <Award className="w-8 h-8 text-slate-600" />
              <span>لا توجد نتائج مسجلة حتى الآن. كن أول من يربح المليون!</span>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const isFirst = idx === 0;
              const isTopThree = idx < 3;

              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isFirst
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : isTopThree
                      ? 'bg-slate-950 border-slate-700'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* الترتيب بالأرقام العربية */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isFirst
                          ? 'bg-amber-500 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {toArabicNumerals(idx + 1)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">{entry.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {toArabicNumerals(entry.questionsAnswered)} أسئلة صحيحة · {entry.date}
                      </span>
                    </div>
                  </div>

                  <span className="font-black text-sm text-amber-300 tabular-nums">
                    {formatEgyptianPound(entry.prize)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* تذييل النافذة */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          {entries.length > 0 && (
            <button
              onClick={onClearLeaderboard}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all mr-auto cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
