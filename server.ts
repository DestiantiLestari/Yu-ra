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
      const { messages, userProfile } = req.body;
      const key = process.env.GEMINI_API_KEY;

      if (!key) {
        // Comforting fallback simulated AI responses for demo/clean state when API key is pending
        const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
        let reply = "My dear, I am fully listening. I am currently running in offline comfort mode. Take a slow, deep breath, and remember that you don't have to carry this stress all by yourself today.";
        
        if (lastUserMsg.includes('burnout') || lastUserMsg.includes('exhaust')) {
          reply = "The exhaustion you are feeling is a real message from your delicate system, my friend. Give yourself sweet permission to untether from your duties for the next few hours. Let's start with a cooling glass of water and five deep inhales.";
        } else if (lastUserMsg.includes('anxious') || lastUserMsg.includes('anxiety') || lastUserMsg.includes('panic')) {
          reply = "Your heart is beating fast, and your throat feels tight. This anxious wave is scary, but it WILL pass. Place your palm flat against your chest. Feel the solid ground beneath your feet. I am holding space for you. Breathe in for 4, hold for 4, exhale for 4.";
        } else if (lastUserMsg.includes('overthink') || lastUserMsg.includes('mind is full')) {
          reply = "Our minds sometimes resemble a crowded room where everyone is talking at once. Let us write those racing thoughts on virtual petals of a flower, then let them drift down a quiet steam. You are safe here. Can you share one single thought you can release right now?";
        } else if (lastUserMsg.includes('help') || lastUserMsg.includes('hello') || lastUserMsg.includes('hi')) {
          reply = "Hello, sweet soul. I am Aura, your companion. Whether you need to dump heavy emotions, seek a gentle breathing exercise, or simply express your gratitude, tell me what is inside your heart right now.";
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

      const systemInstruction = `You are "Aura", a loving, warm, wisdom-sharing and comforting AI emotional companion for "Yuéra", a dedicated emotional wellness platform for women and female students dealing with stress, burnout, anxiety, overthinking, and emotional pressures.
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
