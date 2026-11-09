import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// تهيئة عميل Gemini API الآمن من جانب الخادم
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// مسار توليد سؤال ذكي جديد باللغة العربية عبر الذكاء الاصطناعي
app.post('/api/generate-question', async (req: Request, res: Response) => {
  try {
    const { level, category } = req.body;
    const targetLevel = Number(level) || 1;
    const targetCategory = category || 'ثقافة عامة وتاريخ';

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server',
      });
    }

    const prompt = `أنت المعد الرئيسي لبرنامج المسابقات التلفزيوني "من سيربح المليون: النسخة المستقبلية".
أنشئ سؤالاً جديداً ومميزاً ودقيقاً علمياً وثقافياً باللغة العربية الفصحى.
- مستوى صعوبة السؤال: ${targetLevel} من أصل ١٥ (حيث ١ بسيط جداً و١٥ لسؤال المليون الكبير شديد الدقة والعمق).
- مجال السؤال المفضل: ${targetCategory}.
- قم بتقديم ٤ خيارات دقيقة ومتباينة باللغة العربية.
- حدد المؤشر الصحيح (0 إلى 3).
- قدم شرحاً موجزاً وممتعاً لسبب صحة الإجابة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'أنت صانع أسئلة محترف لبرنامج من سيربح المليون. أجب دائماً باللغة العربية وبصيغة JSON المحددة فقط.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: 'نص السؤال باللغة العربية' },
            category: { type: Type.STRING, description: 'تصنيف السؤال' },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '٤ خيارات للإجابة',
            },
            correctIndex: { type: Type.INTEGER, description: 'رقم الخيار الصحيح من 0 إلى 3' },
            explanation: { type: Type.STRING, description: 'تفسير الإجابة الصحيحة' },
          },
          required: ['question', 'category', 'options', 'correctIndex', 'explanation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4) {
      throw new Error('Invalid question format from AI');
    }

    res.json({
      id: `ai-${Date.now()}`,
      level: targetLevel,
      category: parsed.category || targetCategory,
      question: parsed.question,
      options: parsed.options,
      correctIndex: parsed.correctIndex,
      explanation: parsed.explanation,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: errorMsg });
  }
});

// مسار توليد تعليق تفاعلي درامي من المذيع الافتراضي "سراج"
app.post('/api/host-commentary', async (req: Request, res: Response) => {
  try {
    const { action, currentLevel, prizeWon, questionText } = req.body;

    if (!ai) {
      return res.json({
        comment: 'المذيع سراج: تركيزك رائع يا صديقي، رحلتنا نحو المليون مستمرة بحماس!',
      });
    }

    const prompt = `أنت المذيع الافتراضي "سراج" لبرنامج "من سيربح المليون: المستقبل".
شخصيتك: كاريزمي، مثقف، درامي، مشجع، ولديك روح الفكاهة الرصينة مثل المذيعين الكبار.
الحدث الحالي:
- الإجراء: ${action} (مثال: answer_correct, answer_wrong, reached_milestone, lock_answer, withdraw)
- السؤال الحالي: رقم ${currentLevel} من ١٥
- الرصيد الحالي بالجنيه المصري: ${prizeWon}
- موضوع أو نص السؤال: ${questionText || 'غير محدد'}

اكتب جملة أو جملتين باللغة العربية تخاطب بها المتسابق مباشرة بأسلوب تلفزيوني مشوق ومؤثر.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'أنت المذيع سراج. أجب بعبارة تلفزيونية عربية قصيرة وجذابة.',
      },
    });

    res.json({ comment: response.text?.trim() || 'إلى الأمام دائماً نحو حلم المليون!' });
  } catch {
    res.json({ comment: 'أنت تؤدي أداءً استثنائياً في استوديو المليونير!' });
  }
});

// تكامل مع Vite للتطوير أو تقديم الملفات الثابتة في الإنتاج
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
