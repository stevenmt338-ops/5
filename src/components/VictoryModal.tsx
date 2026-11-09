import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { formatEgyptianPound, toArabicNumerals } from '../utils/arabicUtils';
import { RotateCcw, Award, CheckCircle2, Trophy } from 'lucide-react';
import { gameAudio } from '../utils/audioSystem';

interface VictoryModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onSaveScore: (name: string) => void;
  timeSpentSeconds: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onRestart,
  onSaveScore,
  timeSpentSeconds,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      gameAudio.playMillionWinSymphony();
      gameAudio.speakArabic('ألف مبروك! لقد دخلت التاريخ وفزت بجائزة المليون جنيه مصري كاملة!');

      // إطلاق مؤثرات الكونفيتي الاحتفالية المتكررة
      const duration = 4.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#fbbf24', '#06b6d4', '#10b981'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#fbbf24', '#06b6d4', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center flex flex-col items-center gap-6 my-auto">
        {/* شارة درع المليون الذهبي الاستثنائي */}
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/40 p-1 bg-slate-950">
            <img
              src="/src/assets/images/million_trophy_future_1794181279521.jpg"
              alt="كأس المليون جنيه مصري"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -top-3 -right-3 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg">
            المليونير الذهبي
          </span>
        </div>

        {/* العناوين والتبريكات */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300">
            ألف مبروك! لقد ربحت المليون!
          </h2>
          <p className="text-base sm:text-lg font-bold text-amber-300">
            {formatEgyptianPound(1000000)}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            أثبتَّ أنك تمتلك علماً غزيراً وثقافة استثنائية وثباتاً فولاذياً تحت الضغط. لقد اجتزت جميع الأسئلة الـ ١٥ بنجاح باهر!
          </p>
        </div>

        {/* بطاقة إحصائيات الإنجاز */}
        <div className="w-full grid grid-cols-2 gap-3 p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">الأسئلة المجابة:</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              ١٥ من ١٥ سؤالاً (١٠٠٪)
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">الوقت المستغرق:</span>
            <span className="text-sm font-bold text-cyan-300 tabular-nums">
              {toArabicNumerals(minutes)} دقيقة و {toArabicNumerals(seconds)} ثانية
            </span>
          </div>
        </div>

        {/* نموذج تسجيل الاسم في لوحة الشرف */}
        {!hasSaved ? (
          <form onSubmit={handleSave} className="w-full flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 text-right">
              سجل اسمك في لوحة شرف المليونيرات:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="اكتب اسمك الكريم هنا..."
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 text-right"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>حفظ في اللوحة</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full py-2.5 px-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم تخليد اسمك في لوحة شرف المليونير بنجاح!</span>
          </div>
        )}

        {/* أزرار الإجراء */}
        <div className="w-full flex items-center gap-3 pt-2">
          <button
            onClick={onRestart}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>خوض مغامرة المليون مجدداً</span>
          </button>
        </div>
      </div>
    </div>
  );
};
