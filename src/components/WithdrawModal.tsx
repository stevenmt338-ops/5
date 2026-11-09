import React from 'react';
import { formatEgyptianPound } from '../utils/arabicUtils';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmWithdraw: () => void;
  currentWonPrize: number;
  guaranteedPrize: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onConfirmWithdraw,
  currentWonPrize,
  guaranteedPrize,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl relative text-right flex flex-col gap-5">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">قرار الانسحاب بالرصيد</h3>
            <p className="text-xs text-slate-400">الاحتفاظ بالمبلغ المكتسب وتجنب المخاطرة</p>
          </div>
        </div>

        {/* شرح ومقارنة المبالغ */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">المبلغ الذي ستغادر به الآن:</span>
            <span className="text-base font-bold text-amber-300">
              {formatEgyptianPound(currentWonPrize)}
            </span>
          </div>

          <div className="h-px bg-slate-800"></div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">المبلغ المضمون في حال الخطأ:</span>
            <span className="text-emerald-400 font-semibold">
              {formatEgyptianPound(guaranteedPrize)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          هل ترغب حقاً في إنهاء المسابقة وتثبيت فوزك بـ{' '}
          <strong className="text-amber-300">{formatEgyptianPound(currentWonPrize)}</strong>؟ قرار حكيم يحميك من خسارة رصيدك الكبير!
        </p>

        {/* الأزرار */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onConfirmWithdraw}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>نعم، أؤكد الانسحاب</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            متابعة اللعب والمغامرة
          </button>
        </div>
      </div>
    </div>
  );
};
