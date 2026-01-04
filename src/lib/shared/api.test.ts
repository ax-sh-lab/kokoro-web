import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { describe, it } from "vitest";

describe(
  "test api",
  () => {
    it("should ", async () => {
      const host = "http://localhost:8880";
      const openai = new OpenAI({
        baseURL: host + "/api/v1",
        apiKey: "your-kokoro-api-key",
      });
      const speechFile = path.resolve("./speech.mp3");
      try {
        const mp3 = await openai.audio.speech.create({
          model: "model_q8f16",
          // @ts-ignore
          voice: "af_heart",
          input: "Today is a wonderful day to build something people love!",
        });
        console.log(mp3);

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
      } catch (e) {
        console.dir(e);
      }
    });
  },
  { timeout: 6000000 },
);
