import React from 'react';
import { HelpCircle, X, Shield, Award, Users, PhoneCall, RefreshCw, LogOut } from 'lucide-react';
import { formatEgyptianPound, toArabicNumerals } from '../utils/arabicUtils';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-indigo-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">قواعد ودليل المسابقة</h3>
            <p className="text-xs text-slate-400">كل ما تحتاج لمعرفته للوصول إلى المليون جنيه مصري</p>
          </div>
        </div>

        {/* أقسام القواعد */}
        <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* ١. هيكل الأسئلة والجوائز */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Award className="w-4 h-4" />
              <span>١. سلم الـ ١٥ سؤالاً والجائزة الكبرى</span>
            </div>
            <p className="text-slate-300">
              تتكون المسابقة من ١٥ سؤالاً متدرجة الصعوبة تبدأ من {formatEgyptianPound(100)} وصولاً إلى السؤال الخامس عشر الحاسم بقيمة {formatEgyptianPound(1000000)} كاملة.
            </p>
          </div>

          {/* ٢. محطات الأمان المضمونة */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>٢. محطات الأمان المضمونة</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pr-1">
              <li>
                <strong className="text-white">محطة الأمان الأولى:</strong> عند اجتياز السؤال الخامس، تضمن الحصول على {formatEgyptianPound(1000)} كحد أدنى مهما كانت نتيجتك اللاحقة.
              </li>
              <li>
                <strong className="text-white">محطة الأمان الثانية:</strong> عند اجتياز السؤال العاشر، تضمن الحصول على {formatEgyptianPound(32000)} كاملة ومضمونة.
              </li>
            </ul>
          </div>

          {/* ٣. وسائل المساعدة الأربعة */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span>٣. وسائل المساعدة (تُستخدم مرة واحدة في المسابقة)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <span className="font-black text-cyan-400">٥٠</span>
                <div>
                  <strong className="text-white">حذف إجابتين:</strong> يحذف النظام إجابتين خاطئتين ويترك إجابة صحيحة وأخرى خاطئة.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">رأي الجمهور:</strong> تصويت إلكتروني فوري لجمهور الاستوديو لاختيار الإجابة الأرجح.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">اتصال بصديق:</strong> استشارة خبير متخصص لمدة ٣٠ ثانية لمساعدتك في اتخاذ القرار.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">تغيير السؤال:</strong> استبدال السؤال الحالي الصعب بسؤال بديل بنفس القيمة المالية.
                </div>
              </div>
            </div>
          </div>

          {/* ٤. خيار الانسحاب بالرصيد */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <LogOut className="w-4 h-4" />
              <span>٤. حق الانسحاب المشرف بالرصيد</span>
            </div>
            <p className="text-slate-300">
              يمكنك في أي لحظة قبل تثبيت إجابتك أن تطلب الانسحاب لتغادر فوراً بالمبلغ الذي فزت به في السؤال السابق، وتتجنب خطر الإجابة الخاطئة والرجوع لمحطة الأمان.
            </p>
          </div>
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          فهمت القواعد، فلنبدأ التحدي!
        </button>
      </div>
    </div>
  );
};
