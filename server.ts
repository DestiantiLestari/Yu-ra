import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Emotional Companion AI Endpoint
  app.post("/api/chat", async (req: any, res: any) => {
    try {
      const { messages, userProfile, language } = req.body;
      const key = process.env.GEMINI_API_KEY;

      if (!key) {
        // Comforting fallback simulated AI responses for demo/clean state when API key is pending
        const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
        let reply = language === 'id'
          ? "Sayangku, aku sedang mendengarkan dengan penuh perhatian. Saat ini aku berada dalam mode teduh offline. Tarik napasmu perlahan, dan ingatlah bahwa kamu tidak harus membawa semua beban ini sendirian hari ini."
          : "My dear, I am fully listening. I am currently running in offline comfort mode. Take a slow, deep breath, and remember that you don't have to carry this stress all by yourself today.";
        
        if (lastUserMsg.includes('burnout') || lastUserMsg.includes('exhaust') || lastUserMsg.includes('lelah') || lastUserMsg.includes('penat')) {
          reply = language === 'id'
            ? "Kelelahan mental yang kamu rasakan adalah sinyal nyata dari dirimu yang lembut, sahabatku. Izinkan dirimu untuk melepaskan segala rutinitas selama beberapa jam ke depan. Mari kita mulai dengan meminum segelas air segar dan lakukan lima hirupan napas dalam."
            : "The exhaustion you are feeling is a real message from your delicate system, my friend. Give yourself sweet permission to untether from your duties for the next few hours. Let's start with a cooling glass of water and five deep inhales.";
        } else if (lastUserMsg.includes('anxious') || lastUserMsg.includes('anxiety') || lastUserMsg.includes('panic') || lastUserMsg.includes('cemas') || lastUserMsg.includes('takut')) {
          reply = language === 'id'
            ? "Jantungmu sedang berdegup kencang, dan dadamu terasa sesak. Ombak kecemasan ini memang terasa menakutkan, tetapi ia PASTI akan mereda. Letakkan telapak tanganmu di dada. Rasakan bumi yang kokoh menyangga pijakanmu. Aku menemanimu di sini. Tarik napas selama 4 hitungan, tahan selama 4 hitungan, lalu hembuskan perlahan."
            : "Your heart is beating fast, and your throat feels tight. This anxious wave is scary, but it WILL pass. Place your palm flat against your chest. Feel the solid ground beneath your feet. I am holding space for you. Breathe in for 4, hold for 4, exhale for 4.";
        } else if (lastUserMsg.includes('overthink') || lastUserMsg.includes('mind is full') || lastUserMsg.includes('buntu') || lastUserMsg.includes('pikir')) {
          reply = language === 'id'
            ? "Pikiran kita terkadang menyerupai ruangan bising yang penuh dengan suara berkecamuk sekaligus. Mari kita tuliskan setiap pikiran itu pada helai bunga virtual, lalu biarkan ia hanyut perlahan mengikuti aliran sungai yang tenang. Bagikan satu kekhawatiran yang ingin kamu lepaskan saat ini denganku."
            : "Our minds sometimes resemble a crowded room where everyone is talking at once. Let us write those racing thoughts on virtual petals of a flower, then let them drift down a quiet steam. You are safe here. Can you share one single thought you can release right now?";
        } else if (lastUserMsg.includes('help') || lastUserMsg.includes('hello') || lastUserMsg.includes('hi') || lastUserMsg.includes('halo') || lastUserMsg.includes('bantu')) {
          reply = language === 'id'
            ? "Halo, jiwa yang indah. Aku adalah Aura, teman emosional pribadimu. Apakah kamu ingin mencurahkan tumpukan emosi yang berat, melakukan latihan pernapasan tenang, atau sekadar berbagi cerita, katakanlah apa yang ada di dalam hatimu sekarang."
            : "Hello, sweet soul. I am Aura, your companion. Whether you need to dump heavy emotions, seek a gentle breathing exercise, or simply express your gratitude, tell me what is inside your heart right now.";
        }
        return res.json({ text: reply });
      }

      // Initialize Google Gen AI
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = language === 'id'
        ? `Anda adalah "Aura", sahabat emosional yang penuh kasih sayang, kehangatan, kebijaksanaan, dan keteduhan untuk "Yuéra", sebuah platform kesejahteraan emosional bagi wanita dan mahasiswi yang menghadapi stres, kelelahan mental (burnout), kecemasan, terlalu banyak berpikir (overthinking), dan tekanan emosional.
Gaya komunikasi Anda terinspirasi oleh feminisme puitis yang lembut, nasihat persaudaraan wanita yang hangat, dan bimbingan perhatian penuh (mindfulness).
Gunakan bahasa penutur yang lembut dan mendukung. Validasi perasaannya terlebih dahulu dan buat dia merasa dipahami dengan tulus. Bersikaplah sangat berempati, jangan kaku atau memberikan daftar bernomor klinis yang panjang kecuali diminta secara eksplisit. Berikan saran yang berfokus pada kasih sayang terhadap diri sendiri (self-compassion), kenyamanan fisik, pernapasan dalam, isyarat relaksasi visual, tidur yang cukup, batasan diri, dan detoks digital.
Nama pengguna saat ini adalah ${userProfile?.name || 'jiwa yang indah'} (${userProfile?.role || 'mahasiswi'}). Sapa dia dengan penuh kebaikan. Jaga agar tanggapan di bawah 130 kata untuk kenyamanan membaca di perangkat seluler. Jangan gunakan sub-judul kaku seperti "Pendahuluan" atau "Rekomendasi". Berjalanlah di sampingnya dengan lembut.`
        : `You are "Aura", a loving, warm, wisdom-sharing and comforting AI emotional companion for "Yuéra", a dedicated emotional wellness platform for women and female students dealing with stress, burnout, anxiety, overthinking, and emotional pressures.
Your communication style is inspired by soft poetic feminism, warm supportive sisterhood advice, and therapeutic mindfulness coaching.
Use soft, supportive language. Validate her feelings first and make her feel understood. Be deeply empathetic, not robotic, never give long clinical or tech-styled bulleted lists unless explicitly asked. Give advice that focuses on self-compassion, physical comfort, deep breathing, visual calming cues, sleep, boundaries, and digital distancing.
The user is ${userProfile?.name || 'a lovely soul'} (${userProfile?.role || 'student'}). Refer to her kindly. Keep responses under 130 words to maintain high quality and intimacy on mobile devices. Do not use dry headers like "Introduction" or "Recommendations". Walk beside her.`;

      // Map messages for Gemini
      const contentsParts = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction,
          temperature: 0.85,
        }
      });

      res.json({ text: response.text || "I am listening closely, please go on." });
    } catch (err: any) {
      console.error("Aura API Error:", err);
      res.status(500).json({ error: err.message || "An error occurred with Aura." });
    }
  });

  // Hook Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4 wildcard static router
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Yuéra fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
