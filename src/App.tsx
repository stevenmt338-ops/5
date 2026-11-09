import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { PrizeLadder } from './components/PrizeLadder';
import { VirtualHost } from './components/VirtualHost';
import { LifelinesBar } from './components/LifelinesBar';
import { QuestionBox } from './components/QuestionBox';
import { AudienceModal } from './components/AudienceModal';
import { CallFriendModal } from './components/CallFriendModal';
import { WithdrawModal } from './components/WithdrawModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { LeaderboardModal } from './components/LeaderboardModal';

import { Question, LifelineState, HostMood, LeaderboardEntry, getGuaranteedPrize, getCurrentWonPrize, PRIZE_LADDER } from './types/game';
import { getQuestionForLevel } from './data/questionsBank';
import { gameAudio } from './utils/audioSystem';
import { formatEgyptianPound, toArabicNumerals } from './utils/arabicUtils';
import { Sparkles, Trophy, HelpCircle } from 'lucide-react';

export default function App() {
  // حالة اللعبة الأساسية
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  
  // حالة الإجابة والاختيار
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lockedOption, setLockedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // وسائل المساعدة
  const [lifelines, setLifelines] = useState<LifelineState>({
    fiftyFifty: true,
    audiencePoll: true,
    callFriend: true,
    switchQuestion: true,
  });

  // المذيع الافتراضي سراج
  const [hostDialogue, setHostDialogue] = useState<string>('مرحباً بك في أروع ليالي المسابقات التلفزيونية! أمامك ١٥ سؤالاً تفصلك عن المليون جنيه مصري. ركز وتوكل على الله!');
  const [hostMood, setHostMood] = useState<HostMood>('welcome');

  // النوافذ المنبثقة
  const [isAudienceOpen, setIsAudienceOpen] = useState<boolean>(false);
  const [audiencePercentages, setAudiencePercentages] = useState<[number, number, number, number]>([25, 25, 25, 25]);
  const [isFriendOpen, setIsFriendOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<'wrong_answer' | 'withdrawn'>('wrong_answer');
  const [finalPrizeWon, setFinalPrizeWon] = useState<number>(0);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // إعدادات الصوت ومصادر الأسئلة
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [useAiGeneration, setUseAiGeneration] = useState<boolean>(false);

  // الإحصائيات ولوحة الشرف
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const gameTimerRef = useRef<number | null>(null);

  // تحميل لوحة الشرف المحفوظة
  useEffect(() => {
    try {
      const saved = localStorage.getItem('millionaire_arabic_leaderboard');
      if (saved) {
        setLeaderboard(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // مؤقت اللعبة الكلي
  useEffect(() => {
    gameTimerRef.current = window.setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  // تهيئة أو جلب السؤال للمستوى الحالي
  const loadQuestion = useCallback(async (level: number, excluded: string[]) => {
    setIsProcessing(true);
    setSelectedOption(null);
    setLockedOption(null);
    setRevealed(false);
    setHiddenOptions([]);

    let q: Question | null = null;

    // محاولة توليد سؤال ذكي عبر خادم Gemini إذا كان النمط مفعلاً
    if (useAiGeneration) {
      try {
        const res = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.question && data.options) {
            q = data;
          }
        }
      } catch {
        // العودة للبنك المعتمد عند أي خطأ
      }
    }

    if (!q) {
      q = getQuestionForLevel(level, excluded);
    }

    setCurrentQuestion(q);
    setUsedQuestionIds((prev) => [...prev, q!.id]);
    setIsProcessing(false);

    // دقات القلب التفاعلية أثناء التفكير
    gameAudio.startHeartbeat(1100);

    // عبارة المذيع الترحيبية بالسؤال
    if (level === 1) {
      setHostMood('welcome');
      setHostDialogue('فلنبدأ بالسؤال الأول على بركة الله بقيمة ١٠٠ جنيه مصري. خذ وقتك واقرأ الخيارات بتأنٍ.');
    } else if (level === 5) {
      setHostMood('warning');
      setHostDialogue('أنت الآن أمام السؤال الخامس، محطة الأمان الأولى بقيمة ألف جنيه مصري مضمونة. كن دقيقاً!');
    } else if (level === 10) {
      setHostMood('warning');
      setHostDialogue('وصلت للسؤال العاشر، محطة الأمان الثانية بقيمة ٣٢ ألف جنيه مصري! خطوة مصيرية نحو المليون!');
    } else if (level === 15) {
      setHostMood('suspense');
      setHostDialogue('وصلنا إلى القمة! السؤال الخامس عشر والأخير.. سؤال المليون جنيه مصري الكبير! كل مصر والعالم العربي يتابعك بحبس الأنفاس!');
    } else {
      setHostMood('thinking');
      const step = PRIZE_LADDER.find(s => s.level === level);
      setHostDialogue(`السؤال رقم ${toArabicNumerals(level)} بقيمة ${formatEgyptianPound(step?.prize || 0)}. فكر جيداً، كل الخيارات أمامك.`);
    }
  }, [useAiGeneration]);

  // بدء اللعبة لأول مرة
  useEffect(() => {
    loadQuestion(1, []);
  }, [loadQuestion]);

  // إعادة بدء اللعبة بالكامل
  const handleRestartGame = () => {
    gameAudio.stopHeartbeat();
    setCurrentLevel(1);
    setUsedQuestionIds([]);
    setLifelines({
      fiftyFifty: true,
      audiencePoll: true,
      callFriend: true,
      switchQuestion: true,
    });
    setTimeSpentSeconds(0);
    setIsVictoryOpen(false);
    setIsGameOverOpen(false);
    setIsAudienceOpen(false);
    setIsFriendOpen(false);
    setIsWithdrawOpen(false);
    loadQuestion(1, []);
  };

  // اختيار خيار مبدئي
  const handleSelectOption = (index: number) => {
    if (lockedOption !== null || revealed || isProcessing) return;
    setSelectedOption(index);
    gameAudio.playSelectAnswer();
    setHostMood('suspense');
    setHostDialogue('اخترت هذا الجواب.. هل تود التثبيت، أم ترغب في التفكير أكثر أو استخدام وسيلة مساعدة؟');
  };

  // تثبيت الإجابة النهائية (Final Answer)
  const handleLockAnswer = () => {
    if (selectedOption === null || lockedOption !== null || revealed || isProcessing) return;
    
    setLockedOption(selectedOption);
    setIsProcessing(true);
    gameAudio.playFinalAnswerLock();
    gameAudio.startHeartbeat(600); // زيادة سرعة ضربات القلب للتشويق

    setHostMood('suspense');
    setHostDialogue('جواب نهائي! تم تثبيت إجابتك.. دعنا نرى ما إذا كان حدسك الثقافي في محله الصحيح...');

    // محاكاة التوقف الدرامي التلفزيوني لمدة ثانيتين ونصف قبل كشف الإجابة
    setTimeout(() => {
      if (!currentQuestion) return;
      const isCorrect = selectedOption === currentQuestion.correctIndex;
      setRevealed(true);
      setIsProcessing(false);
      gameAudio.stopHeartbeat();

      if (isCorrect) {
        const isMilestone = currentLevel === 5 || currentLevel === 10 || currentLevel === 15;
        gameAudio.playCorrectAnswer(isMilestone);
        setHostMood('celebrating');

        if (currentLevel === 15) {
          // فوز المليون الكبير!
          setFinalPrizeWon(1000000);
          setTimeout(() => {
            setIsVictoryOpen(true);
          }, 1500);
        } else {
          const step = PRIZE_LADDER.find(s => s.level === currentLevel);
          const wonAmount = step ? step.prize : 0;
          setHostDialogue(`إجابة صحيحة وعبقرية! أضفت لرصيدك ${formatEgyptianPound(wonAmount)}. أحسنت صنعاً!`);
        }
      } else {
        // إجابة خاطئة
        gameAudio.playWrongAnswer();
        setHostMood('comforting');
        const guaranteed = getGuaranteedPrize(currentLevel);
        setFinalPrizeWon(guaranteed);
        setGameOverReason('wrong_answer');
        setHostDialogue(`للأسف الإجابة غير صحيحة، والإجابة الدقيقة كانت الخيار المحدد بالأخضر. لقد أديت أداءً مبهراً وغادرت بالمبلغ المضمون!`);
      }
    }, 2400);
  };

  // الانتقال للسؤال التالي
  const handleNextQuestion = () => {
    if (!currentQuestion) return;
    const isCorrect = lockedOption === currentQuestion.correctIndex;

    if (isCorrect) {
      if (currentLevel >= 15) {
        setIsVictoryOpen(true);
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        loadQuestion(nextLevel, usedQuestionIds);
      }
    } else {
      // فتح نافذة نهاية اللعبة
      setIsGameOverOpen(true);
    }
  };

  // الانسحاب بالرصيد الحالي
  const handleConfirmWithdraw = () => {
    setIsWithdrawOpen(false);
    gameAudio.stopHeartbeat();
    const won = getCurrentWonPrize(currentLevel);
    setFinalPrizeWon(won);
    setGameOverReason('withdrawn');
    setHostMood('comforting');
    setHostDialogue(`قرار شجاع وحكيم! تنسحب برأس مرفوع وبرصيد مالي رائع قدره ${formatEgyptianPound(won)}! مبارك لك!`);
    setIsGameOverOpen(true);
  };

  // وسيلة مساعدة: حذف إجابتين (٥٠:٥٠)
  const handleUseFiftyFifty = () => {
    if (!currentQuestion || !lifelines.fiftyFifty || isProcessing || lockedOption !== null) return;
    
    gameAudio.playLifelineSound();
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));

    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== currentQuestion.correctIndex);
    // اختيار عشوائي لاثنين من الخيارات الخاطئة
    incorrectIndices.sort(() => Math.random() - 0.5);
    const toRemove = incorrectIndices.slice(0, 2);

    setHiddenOptions(toRemove);
    // إذا كان الخيار المختار مبدئياً قد تم حذفه، نلغي اختياره
    if (selectedOption !== null && toRemove.includes(selectedOption)) {
      setSelectedOption(null);
    }

    setHostMood('thinking');
    setHostDialogue('قام الكمبيوتر بحذف إجابتين خاطئتين، وبقيت أمامك إجابتان فقط: واحدة صحيحة والأخرى خاطئة!');
  };

  // وسيلة مساعدة: رأي الجمهور
  const handleUseAudience = () => {
    if (!currentQuestion || !lifelines.audiencePoll || isProcessing || lockedOption !== null) return;

    gameAudio.playLifelineSound();
    setLifelines(prev => ({ ...prev, audiencePoll: false }));

    // حساب توزيع ذكي لنسب تصويت الجمهور
    const correctIdx = currentQuestion.correctIndex;
    let correctPct = 65;
    if (currentLevel <= 5) correctPct = 78;
    else if (currentLevel > 10) correctPct = 48;

    const remaining = 100 - correctPct;
    const remainingIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx && !hiddenOptions.includes(idx));
    
    const percentages: [number, number, number, number] = [0, 0, 0, 0];
    percentages[correctIdx] = correctPct;

    if (remainingIndices.length > 0) {
      let allocated = 0;
      remainingIndices.forEach((idx, i) => {
        if (i === remainingIndices.length - 1) {
          percentages[idx] = remaining - allocated;
        } else {
          const share = Math.floor(Math.random() * (remaining - allocated - 5)) + 2;
          percentages[idx] = share;
          allocated += share;
        }
      });
    }

    setAudiencePercentages(percentages);
    setIsAudienceOpen(true);
    setHostMood('thinking');
    setHostDialogue('جمهور الاستوديو صوتوا جميعاً عبر أجهزتهم الإلكترونية، وها هي النسب تظهر على الشاشة أمامك!');
  };

  // وسيلة مساعدة: الاتصال بصديق
  const handleUseFriend = () => {
    if (!currentQuestion || !lifelines.callFriend || isProcessing || lockedOption !== null) return;
    setLifelines(prev => ({ ...prev, callFriend: false }));
    setIsFriendOpen(true);
    setHostMood('thinking');
    setHostDialogue('سنقوم الآن بالاتصال بأحد خبرائك الموثوقين، لديك ٣٠ ثانية من الحوار المثمر معه!');
  };

  // وسيلة مساعدة: استبدال السؤال
  const handleUseSwitchQuestion = () => {
    if (!currentQuestion || !lifelines.switchQuestion || isProcessing || lockedOption !== null) return;

    gameAudio.playLifelineSound();
    setLifelines(prev => ({ ...prev, switchQuestion: false }));
    setHostMood('thinking');
    setHostDialogue('بناءً على رغبتك، تم إلغاء السؤال الحالي وتجهيز سؤال جديد تماماً بنفس القيمة المالية!');
    loadQuestion(currentLevel, usedQuestionIds);
  };

  // حفظ النتيجة في لوحة الشرف
  const handleSaveScore = (name: string) => {
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}`,
      name,
      prize: finalPrizeWon,
      questionsAnswered: currentLevel > 1 ? (gameOverReason === 'wrong_answer' ? currentLevel - 1 : currentLevel - 1) : 0,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
      timeSpentSeconds,
    };

    const updated = [newEntry, ...leaderboard]
      .sort((a, b) => b.prize - a.prize)
      .slice(0, 20);

    setLeaderboard(updated);
    try {
      localStorage.setItem('millionaire_arabic_leaderboard', JSON.stringify(updated));
    } catch {}
  };

  const handleClearLeaderboard = () => {
    setLeaderboard([]);
    try {
      localStorage.removeItem('millionaire_arabic_leaderboard');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      {/* خلفية الاستوديو السينمائية التلفزيونية عالية الدقة المولدة */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/millionaire_future_studio_1794181280249.jpg"
          alt="استوديو من سيربح المليون المستقبلي"
          className="w-full h-full object-cover object-center opacity-25 filter blur-[1px] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-indigo-950/70"></div>
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40"></div>
      </div>

      {/* شريط الرأس وفق عقد Top Bar Contract */}
      <HeaderBar
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onRestartGame={handleRestartGame}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
      />

      {/* المحتوى الرئيسي للعبة */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 z-10 flex flex-col gap-6">
        {/* شريط الإشعار العلوي والتحكم في الأسئلة الذكية */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-amber-400 font-bold">الشعار:</span>
            <span>هل تمتلك الذكاء للوصول إلى المليون؟</span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">العملة: الجنيه المصري</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseAiGeneration(!useAiGeneration)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                useAiGeneration
                  ? 'bg-purple-950/80 border-purple-400 text-purple-300 shadow-sm shadow-purple-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{useAiGeneration ? 'الذكاء الاصطناعي مفعّل (أسئلة لانهائية)' : 'تفعيل الذكاء الاصطناعي للأسئلة'}</span>
            </button>
          </div>
        </div>

        {/* توزيع الشاشة: ساحة اللعب المركزية + سلم الجوائز الجانبي */}
        <div className="w-full flex flex-col-reverse lg:flex-row items-start gap-6">
          {/* العمود الأيمن: بطاقة المذيع سراج + وسائل المساعدة + صندوق السؤال */}
          <div className="flex-1 w-full flex flex-col gap-5">
            {/* بطاقة المذيع الافتراضي التفاعلي "سراج" */}
            <VirtualHost
              dialogue={hostDialogue}
              mood={hostMood}
              voiceEnabled={voiceEnabled}
            />

            {/* شريط وسائل المساعدة الأربعة */}
            <LifelinesBar
              lifelines={lifelines}
              onUseFiftyFifty={handleUseFiftyFifty}
              onUseAudience={handleUseAudience}
              onUseFriend={handleUseFriend}
              onUseSwitchQuestion={handleUseSwitchQuestion}
              disabled={lockedOption !== null || revealed || isProcessing}
            />

            {/* صندوق السؤال الرئيسي مع الخيارات الأربعة */}
            {currentQuestion ? (
              <QuestionBox
                question={currentQuestion}
                selectedOption={selectedOption}
                lockedOption={lockedOption}
                revealed={revealed}
                hiddenOptions={hiddenOptions}
                onSelectOption={handleSelectOption}
                onLockAnswer={handleLockAnswer}
                onNextQuestion={handleNextQuestion}
                onWithdraw={() => setIsWithdrawOpen(true)}
                isProcessing={isProcessing}
              />
            ) : (
              <div className="w-full h-64 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <span className="text-slate-400 text-sm animate-pulse">جاري تحضير السؤال في الاستوديو...</span>
              </div>
            )}
          </div>

          {/* العمود الأيسر: سلم الجوائز المالي الـ ١٥ المعتمد بالجنيه المصري */}
          <PrizeLadder currentLevel={currentLevel} />
        </div>
      </main>

      {/* التذييل الأنيق والمهني */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-4 px-4 sm:px-6 z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">من سيربح المليون؟: النسخة المستقبلية</span>
            <span>·</span>
            <span>جميع الحقوق محفوظة باللغة العربية</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              دليل القواعد
            </button>
            <span>·</span>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              قائمة الفائزين
            </button>
          </div>
        </div>
      </footer>

      {/* النوافذ المنبثقة التفاعلية */}
      <AudienceModal
        isOpen={isAudienceOpen}
        onClose={() => setIsAudienceOpen(false)}
        percentages={audiencePercentages}
        hiddenOptions={hiddenOptions}
      />

      {currentQuestion && (
        <CallFriendModal
          isOpen={isFriendOpen}
          onClose={() => setIsFriendOpen(false)}
          correctIndex={currentQuestion.correctIndex}
          questionLevel={currentLevel}
          questionCategory={currentQuestion.category}
        />
      )}

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onConfirmWithdraw={handleConfirmWithdraw}
        currentWonPrize={getCurrentWonPrize(currentLevel)}
        guaranteedPrize={getGuaranteedPrize(currentLevel)}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        onRestart={handleRestartGame}
        onSaveScore={handleSaveScore}
        timeSpentSeconds={timeSpentSeconds}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        onRestart={handleRestartGame}
        onSaveScore={handleSaveScore}
        prizeWon={finalPrizeWon}
        questionsAnswered={currentLevel > 1 ? currentLevel - 1 : 0}
        timeSpentSeconds={timeSpentSeconds}
        reason={gameOverReason}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        onClearLeaderboard={handleClearLeaderboard}
      />
    </div>
  );
}
