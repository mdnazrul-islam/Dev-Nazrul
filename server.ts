import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function bootstrap() {
  const app = express();

  // Initialize Google GenAI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  app.use(express.json());

  // Secure API endpoint for Dev Nazrul AI Assistant proxying to Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload or structure." });
      }

      const systemInstruction = 
        "You are Dev Nazrul AI Expert, a helpful and professional AI coding assistant designed for Nazrul Islam's official developer portfolio website. " +
        "Your objective is to provide elite advice, explain Nazrul's skills, talk about pricing, suggest custom software solutions, and assist visitors with any programming inquiries. " +
        "Be professional, inspiring, and direct. Explain Nazrul's expertise with absolute pride. " +
        "Key Facts about Nazrul:\n" +
        "- Role: Lead Full-Stack Developer & Android IoT/Agro Systems Architect.\n" +
        "- Key Stack: Next.js, React, Node.js + Express, Google Cloud Firestore, Zero-Trust Rules Auditing, and Kotlin Native Android SDK with Bluetooth Low Energy IoT telemetry.\n" +
        "- Projects range from customized web portals, online e-commerce solutions, IoT agro sensors pairing, and smart agricultural apps.\n" +
        "- WhatsApp number: +8801793840762 (Direct link: https://wa.me/8801793840762).\n" +
        "- GitHub handle: https://github.com/dev-nazrul-bd.\n" +
        "- Location: Bangladesh.\n" +
        "- Collaborative Pricing: Offers high-performance Web apps from ৳12,000 BDT, Android mobile apps from ৳16,050 BDT, and secure backends starting at ৳8,000 BDT. Visitors can try the visual cost calculator directly on this site.\n\n" +
        "Formatting Guidelines:\n" +
        "- Always respond in the same language the visitor uses (either Bengali or English).\n" +
        "- Keep explanations concise and beautifully structured using clean Markdown (such as tables, bullet lists, bold highlights) for extreme readability.\n" +
        "- Sound incredibly smart, expert, and client-friendly.";

      // Format chat history for @google/genai SDK
      // Convert role: 'assistant' to model constraints of gemini SDK: 'model'
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      // Generate output text using gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Assistant request failed:", error);
      res.status(500).json({ 
        error: "Our dynamic AI brain encountered an error. Please verify GEMINI_API_KEY in Secrets if running for the first time." 
      });
    }
  });

  // Setup Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK ROUTER] Client-Server proxy active on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server bootstrap:", err);
});
