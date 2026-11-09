/**
 * تعريف الأنواع للعبة من سيربح المليون: المستقبل
 */

export interface Question {
  id: string;
  level: number; // 1 to 15
  category: string; // e.g. "تاريخ وحضارة", "علوم وتكنولوجيا", "ثقافة عامة", "أدب ولغة", "جغرافيا"
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface LadderStep {
  level: number;
  prize: number; // بالجنيه المصري
  isMilestone: boolean; // محطات الأمان: السؤال 5، 10، 15
  label: string;
}

export interface LifelineState {
  fiftyFifty: boolean;      // حذف إجابتين (متاحة أم تم استخدامها)
  audiencePoll: boolean;    // رأي الجمهور
  callFriend: boolean;      // الاتصال بصديق
  switchQuestion: boolean;  // تغيير السؤال
}

export interface AudienceVote {
  percentages: [number, number, number, number];
  highestOption: number;
}

export interface FriendOption {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarSeed: string;
  confidence: string; // e.g. "واثق جداً", "يميل إلى"
}

export interface FriendResponse {
  friend: FriendOption;
  recommendedIndex: number;
  dialogue: string;
}

export type HostMood = 'welcome' | 'suspense' | 'thinking' | 'celebrating' | 'comforting' | 'warning';

export interface HostMessage {
  text: string;
  mood: HostMood;
  soundCue?: 'tension' | 'applause' | 'chime';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  prize: number;
  questionsAnswered: number;
  date: string;
  timeSpentSeconds: number;
}

// سلم الجوائز الـ ١٥ المعتمد بالجنيه المصري
export const PRIZE_LADDER: LadderStep[] = [
  { level: 15, prize: 1000000, isMilestone: true,  label: 'الجائزة الكبرى: مليون جنيه مصري' },
  { level: 14, prize: 500000,  isMilestone: false, label: '٥٠٠ ألف جنيه مصري' },
  { level: 13, prize: 250000,  isMilestone: false, label: '٢٥٠ ألف جنيه مصري' },
  { level: 12, prize: 125000,  isMilestone: false, label: '١٢٥ ألف جنيه مصري' },
  { level: 11, prize: 64000,   isMilestone: false, label: '٦٤ ألف جنيه مصري' },
  { level: 10, prize: 32000,   isMilestone: true,  label: 'محطة أمان ثانية: ٣٢ ألف جنيه مصري' },
  { level: 9,  prize: 16000,   isMilestone: false, label: '١٦ ألف جنيه مصري' },
  { level: 8,  prize: 8000,    isMilestone: false, label: '٨ آلاف جنيه مصري' },
  { level: 7,  prize: 4000,    isMilestone: false, label: '٤ آلاف جنيه مصري' },
  { level: 6,  prize: 2000,    isMilestone: false, label: 'ألفان جنيه مصري' },
  { level: 5,  prize: 1000,    isMilestone: true,  label: 'محطة أمان أولى: ألف جنيه مصري' },
  { level: 4,  prize: 500,     isMilestone: false, label: '٥٠٠ جنيه مصري' },
  { level: 3,  prize: 300,     isMilestone: false, label: '٣٠٠ جنيه مصري' },
  { level: 2,  prize: 200,     isMilestone: false, label: '٢٠٠ جنيه مصري' },
  { level: 1,  prize: 100,     isMilestone: false, label: '١٠٠ جنيه مصري' },
];

// حساب الرصيد المضمون بناءً على رقم السؤال الحالي
export function getGuaranteedPrize(currentLevel: number): number {
  if (currentLevel > 15) return 1000000;
  if (currentLevel > 10) return 32000;
  if (currentLevel > 5) return 1000;
  return 0;
}

// حساب الرصيد الفعلي الحالي (قيمة السؤال السابق المجاب بنجاح)
export function getCurrentWonPrize(currentLevel: number): number {
  if (currentLevel <= 1) return 0;
  const previousLevel = currentLevel - 1;
  const step = PRIZE_LADDER.find(s => s.level === previousLevel);
  return step ? step.prize : 0;
}
