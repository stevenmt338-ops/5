import React from 'react';
import { Question } from '../types/game';
import { ARABIC_OPTION_LETTERS, toArabicNumerals, formatEgyptianPound, formatPoundShort } from '../utils/arabicUtils';
import { PRIZE_LADDER, getCurrentWonPrize } from '../types/game';
import { CheckCircle2, XCircle, ArrowLeft, LogOut, Check, Info } from 'lucide-react';

interface QuestionBoxProps {
  question: Question;
  selectedOption: number | null;
  lockedOption: number | null;
  revealed: boolean;
  hiddenOptions: number[]; // خيارات محذوفة بواسطة ٥٠:٥٠
  onSelectOption: (index: number) => void;
  onLockAnswer: () => void;
  onNextQuestion: () => void;
  onWithdraw: () => void;
  isProcessing: boolean;
}

export const QuestionBox: React.FC<QuestionBoxProps> = ({
  question,
  selectedOption,
  lockedOption,
  revealed,
  hiddenOptions,
  onSelectOption,
  onLockAnswer,
  onNextQuestion,
  onWithdraw,
  isProcessing,
}) => {
  const currentStep = PRIZE_LADDER.find(s => s.level === question.level);
  const currentPrize = currentStep ? currentStep.prize : 100;
  const currentWon = getCurrentWonPrize(question.level);
  const isCorrect = lockedOption !== null && lockedOption === question.correctIndex;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* شريط معلومات السؤال: الفئة ورقم السؤال والمبلغ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-cyan-400">
            السؤال {toArabicNumerals(question.level)} من ١٥
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{question.category}</span>
          {currentStep?.isMilestone && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400 font-bold">محطة أمان</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-amber-300 font-bold tracking-wide">
            قيمة السؤال: {formatEgyptianPound(currentPrize)}
          </div>
          {currentWon > 0 && !revealed && (
            <button
              onClick={onWithdraw}
              disabled={isProcessing}
              title="الانسحاب بالرصيد الحالي بدلاً من المخاطرة"
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-900/40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>انسحاب بـ {formatPoundShort(currentWon)}</span>
            </button>
          )}
        </div>
      </div>

      {/* إطار نص السؤال الكبير ذو الطابع التلفزيوني المميز */}
      <div className="relative w-full bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-indigo-950/90 border-2 border-indigo-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed tracking-wide select-none">
          {question.question}
        </h2>
      </div>

      {/* شبكة الخيارات الأربعة (أ، ب، ج، د) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
        {question.options.map((optionText, index) => {
          const isHidden = hiddenOptions.includes(index);
          const isSelected = selectedOption === index;
          const isLocked = lockedOption === index;
          const isThisCorrect = index === question.correctIndex;

          if (isHidden) {
            // الخيار المحذوف بواسطة وسيلة ٥٠:٥٠
            return (
              <div
                key={index}
                className="h-14 sm:h-16 rounded-xl border border-slate-900 bg-slate-950/30 opacity-20 pointer-events-none flex items-center px-4"
              >
                <span className="text-slate-700 font-bold">
                  {ARABIC_OPTION_LETTERS[index]}: ---
                </span>
              </div>
            );
          }

          // تحديد مظهر الخيار بناءً على حالته
          let buttonStyles = 'bg-slate-900/80 border-slate-700 text-slate-100 hover:border-amber-400/80 hover:bg-slate-800/90';
          let letterBadgeStyles = 'bg-slate-800 text-amber-400 border-slate-600';

          if (revealed) {
            if (isThisCorrect) {
              // الخيار الصحيح (أخضر زمردي متألق)
              buttonStyles = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/30 scale-[1.01]';
              letterBadgeStyles = 'bg-emerald-600 text-white border-emerald-400';
            } else if (isLocked && !isThisCorrect) {
              // الخيار الخاطئ الذي تم تثبيته (أحمر)
              buttonStyles = 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-lg shadow-rose-500/30';
              letterBadgeStyles = 'bg-rose-600 text-white border-rose-400';
            } else {
              buttonStyles = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-50';
              letterBadgeStyles = 'bg-slate-900 text-slate-600 border-slate-800';
            }
          } else if (isLocked) {
            // الإجابة المثبتة في مرحلة الترقب والتوتر (برتقالي ذهبي متوهج)
            buttonStyles = 'bg-amber-950/90 border-amber-400 text-amber-100 shadow-lg shadow-amber-500/40 animate-pulse';
            letterBadgeStyles = 'bg-amber-500 text-slate-950 border-amber-300 font-black';
          } else if (isSelected) {
            // الخيار المحدد مبدئياً قبل التثبيت (أصفر ذهبي)
            buttonStyles = 'bg-yellow-950/60 border-yellow-400 text-yellow-100 shadow-md shadow-yellow-500/20';
            letterBadgeStyles = 'bg-yellow-500 text-slate-950 border-yellow-300 font-bold';
          }

          return (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={revealed || isProcessing || lockedOption !== null}
              className={`w-full h-14 sm:h-16 rounded-xl border-2 px-4 flex items-center justify-between text-right transition-all duration-150 cursor-pointer ${buttonStyles}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* شارة الحرف العربي (أ، ب، ج، د) */}
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${letterBadgeStyles}`}
                >
                  {ARABIC_OPTION_LETTERS[index]}
                </div>
                {/* نص الخيار */}
                <span className="font-semibold text-sm sm:text-base truncate">
                  {optionText}
                </span>
              </div>

              {/* أيقونة الحالة عند الكشف */}
              {revealed && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mr-2" />
              )}
              {revealed && isLocked && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mr-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* زر تثبيت الإجابة النهائي عند اختيار خيار ولم يتم تثبيته بعد */}
      {selectedOption !== null && lockedOption === null && !revealed && (
        <div className="w-full flex justify-center pt-2">
          <button
            onClick={onLockAnswer}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>تثبيت الإجابة النهائية (جواب نهائي)</span>
          </button>
        </div>
      )}

      {/* بطاقة التفسير العلمي وزر المتابعة بعد كشف الإجابة */}
      {revealed && (
        <div className="w-full bg-slate-900/90 border border-indigo-900/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-start gap-3 text-right">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-cyan-400 font-bold">
                {isCorrect ? 'إجابة عبقرية صحيحة!' : 'معلومة إثرائية حول السؤال'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                {question.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={onNextQuestion}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm shrink-0 flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isCorrect
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <span>{isCorrect ? (question.level === 15 ? 'إعلان الفائز بالمليون!' : 'السؤال التالي') : 'عرض النتيجة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
