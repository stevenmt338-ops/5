/**
 * نظام المؤثرات الصوتية المركبة ومحرك التعليق الصوتي العربي
 * يعتمد بالكامل على Web Audio API و Web Speech API لتفادي أي مشاكل في الروابط الخارجية
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private heartbeatInterval: number | null = null;
  private suspenseOscillator: OscillatorNode | null = null;
  private suspenseGain: GainNode | null = null;

  constructor() {
    // سيتم تهيئة السياق الصوتي عند أول تفاعل من المستخدم تجنباً لسياسات المتصفح
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopHeartbeat();
      this.stopSuspense();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  // صوت النقر واختيار الإجابة
  public playSelectAnswer() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // صوت تثبيت الإجابة النهائي (Final Answer - نغمة حاسمة درامية)
  public playFinalAnswerLock() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(146.83, now + 0.4);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(224, now);
    osc2.frequency.exponentialRampToValueAtTime(147.5, now + 0.4);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // صوت التوتر ودقات القلب أثناء التفكير
  public startHeartbeat(speedMs: number = 1000) {
    if (!this.soundEnabled) return;
    this.stopHeartbeat();
    this.initContext();

    const playThump = () => {
      if (!this.ctx || !this.soundEnabled) return;
      const now = this.ctx.currentTime;

      // الضربة الأولى
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // الضربة الثانية السريعة بعد 120ms
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(35, now + 0.26);
      gain2.gain.setValueAtTime(0.25, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.26);
    };

    playThump();
    this.heartbeatInterval = window.setInterval(playThump, speedMs);
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // صوت الإجابة الصحيحة (فرحة وتهليل كلاسيكي)
  public playCorrectAnswer(isMajorMilestone: boolean = false) {
    if (!this.soundEnabled) return;
    this.stopHeartbeat();
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = isMajorMilestone 
      ? [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50] // نغمة ملحمية لمحطات الأمان
      : [329.63, 392.00, 523.25, 659.25]; // نغمة فوز قياسية

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.45);
    });
  }

  // صوت الإجابة الخاطئة (صوت خسارة درامي مؤثر)
  public playWrongAnswer() {
    if (!this.soundEnabled) return;
    this.stopHeartbeat();
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [185.0, 174.61, 164.81, 130.81];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0.2, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.18 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.45);
    });
  }

  // صوت استخدام وسيلة مساعدة (تأثير مستقبلي تقني)
  public playLifelineSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // صوت فوز المليون الكبير الأسطوري (سيمفونية احتفالية مع أوتار رقمية متصاعدة)
  public playMillionWinSymphony() {
    if (!this.soundEnabled) return;
    this.stopHeartbeat();
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      [261.63, 329.63, 392.00], // C
      [293.66, 369.99, 440.00], // D
      [329.63, 415.30, 493.88], // E
      [349.23, 440.00, 523.25], // F
      [392.00, 493.88, 587.33], // G
      [523.25, 659.25, 783.99, 1046.50] // C Octave Climax
    ];

    chords.forEach((chord, chordIdx) => {
      const chordStart = now + chordIdx * 0.35;
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, chordStart);

        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(0.18, chordStart + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(chordStart);
        osc.stop(chordStart + 0.75);
      });
    });
  }

  // تشغيل صوت المذيع الافتراضي عبر Web Speech API باللغة العربية
  public speakArabic(text: string) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // إلغاء أي جمل سابقة
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-EG'; // تفضيل اللهجة المصرية أو الفصحى
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // اختيار صوت عربي إذا كان متاحاً في المتصفح
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // تجاهل إذا لم تكن مدعومة
    }
  }

  public stopSuspense() {
    if (this.suspenseOscillator) {
      try {
        this.suspenseOscillator.stop();
        this.suspenseOscillator.disconnect();
      } catch {}
      this.suspenseOscillator = null;
    }
  }
}

export const gameAudio = new AudioSystem();
