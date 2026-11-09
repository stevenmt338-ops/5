import React, { useState, useEffect } from 'react';
import { ARABIC_OPTION_LETTERS, toArabicNumerals } from '../utils/arabicUtils';
import { PhoneCall, X, Clock, UserCheck } from 'lucide-react';
import { gameAudio } from '../utils/audioSystem';

interface FriendInfo {
  id: string;
  name: string;
  role: string;
  specialty: string;
}

const AVAILABLE_FRIENDS: FriendInfo[] = [
  {
    id: 'f1',
    name: 'الدكتور طارق عبد الرحمن',
    role: 'أستاذ التاريخ والآثار المصرية',
    specialty: 'متخصص في التاريخ، الحضارات، الجغرافيا، والآثار',
  },
  {
    id: 'f2',
    name: 'المهندسة نور الهدى',
    role: 'باحثة في الذكاء الاصطناعي وفيزياء الفضاء',
    specialty: 'متخصصة في العلوم الدقيقة، الفلك، والتكنولوجيا',
  },
  {
    id: 'f3',
    name: 'الأستاذ كمال الشناوي',
    role: 'معلم لغة عربية وكاتب مسرحي',
    specialty: 'متخصص في الأدب، الشعر، السينما، والثقافة العامة',
  },
];

interface CallFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctIndex: number;
  questionLevel: number;
  questionCategory: string;
}

export const CallFriendModal: React.FC<CallFriendModalProps> = ({
  isOpen,
  onClose,
  correctIndex,
  questionLevel,
  questionCategory,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<FriendInfo | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [friendAdvice, setFriendAdvice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFriend(null);
      setIsCalling(false);
      setSecondsLeft(30);
      setFriendAdvice(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: number;
    if (isCalling && secondsLeft > 0) {
      timer = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsCalling(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCalling, secondsLeft]);

  const handleStartCall = (friend: FriendInfo) => {
    setSelectedFriend(friend);
    setIsCalling(true);
    setSecondsLeft(30);
    gameAudio.playLifelineSound();

    // صياغة رد الصديق بدقة بناءً على مستوى الصعوبة
    setTimeout(() => {
      const correctLetter = ARABIC_OPTION_LETTERS[correctIndex];
      let confidence = 85;
      if (questionLevel > 10) confidence = 70;
      if (questionLevel > 13) confidence = 55;

      const dialogues = [
        `أهلاً بك يا بطل! سؤال دقيق جداً في ${questionCategory}. بعد تفكير سريع ومراجعة معلوماتي، أنا شبه متأكد أن الإجابة الصحيحة هي الخيار (${correctLetter}) بنسبة ثقة حوالي ${toArabicNumerals(confidence)}٪. توكل على الله وثبّتها!`,
        `تحياتي يا صديقي! فخور بوصولك لهذا المستوى المشرف. هذا السؤال يحتاج دقة، ولكن من واقع اطلاعي فإن الخيار الأقرب للصواب دون شك هو (${correctLetter}). نسبة اطمئناني هي ${toArabicNumerals(confidence)}٪.`,
        `أهلاً يا غالي! أتابعك على الشاشة بحماس. هذا الموضوع مألوف لدي، والإجابة الدقيقة حسب المصادر هي الخيار (${correctLetter}). لا تتردد كثيراً!`,
      ];

      const advice = dialogues[Math.floor(Math.random() * dialogues.length)];
      setFriendAdvice(advice);
      gameAudio.speakArabic(advice);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative text-right flex flex-col gap-5">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">الاتصال بصديق</h3>
              <p className="text-xs text-slate-400">مكالمة استشارية مباشرة لمدة ٣٠ ثانية</p>
            </div>
          </div>

          {isCalling && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-300 font-bold text-sm">
              <Clock className="w-4 h-4 animate-spin text-rose-400" />
              <span className="tabular-nums">{toArabicNumerals(secondsLeft)} ثانية</span>
            </div>
          )}
        </div>

        {/* قائمة الأصدقاء للاختيار */}
        {!selectedFriend ? (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300">
              اختر أحد الخبراء المتاحين لمساعدتك:
            </span>
            {AVAILABLE_FRIENDS.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleStartCall(friend)}
                className="w-full text-right p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {friend.name}
                    </span>
                    <span className="text-xs text-emerald-400/90">{friend.role}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{friend.specialty}</span>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0 mr-2" />
              </button>
            ))}
          </div>
        ) : (
          /* تفاصيل المكالمة الجارية ورد الصديق */
          <div className="flex flex-col gap-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">{selectedFriend.name}</span>
                  <span className="text-xs text-emerald-400">{selectedFriend.role}</span>
                </div>
              </div>
              <span className="text-xs text-emerald-400/80 font-medium">مكالمة نشطة الآن</span>
            </div>

            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
              {friendAdvice ? (
                <p className="text-sm text-slate-100 leading-relaxed font-medium">
                  {friendAdvice}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>جاري التواصل مع {selectedFriend.name} واستعراض السؤال...</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              إنهاء المكالمة والعودة للسؤال
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
