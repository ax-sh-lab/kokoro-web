import { bypass, http, HttpResponse, passthrough } from "msw";

const espeak = http.get(
  "https://cdn.jsdelivr.net/npm/espeak-ng@1.0.2/dist/espeak-ng.wasm",
  async () => {
    console.log("MSW - Intercepted espeak-ng.wasm request");

    // bypass() tells MSW not to intercept this fetch
    const mockWasm = await fetch(bypass("/espeak-ng.wasm"));
    const buffer = await mockWasm.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: { "Content-Type": "application/wasm" },
    });
  },
);

const ffmpeg = http.get(
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm",
  async () => {
    const mockWasm = await fetch(bypass("/ffmpeg-core.wasm"));
    const buffer = await mockWasm.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: { "Content-Type": "application/wasm" },
    });
  },
);

const ffmpegCore = http.get(
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js",
  async () => {
    const response = await fetch(bypass("/ffmpeg-core.js"));
    const text = await response.text();
    console.log("MJS file size:", text.length);

    return HttpResponse.text(text, {
      headers: { "Content-Type": "application/javascript" },
    });
  },
);

const kokoro = http.get(
  "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/onnx/model.onnx",
  async () => {
    const mockWasm = await fetch(bypass("/model.onnx"));
    const buffer = await mockWasm.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: { "Content-Type": "application/wasm" },
    });
  },
);
const kokoroSmall = http.get(
  "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/onnx/model_q8f16.onnx",
  async () => {
    const mockWasm = await fetch(bypass("/model_q8f16.onnx"));
    const buffer = await mockWasm.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: { "Content-Type": "application/wasm" },
    });
  },
);

const ortCore = http.get(
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0-dev.20250206-d981b153d3/dist/ort-wasm-simd-threaded.jsep.mjs",
  async () => {
    console.log("MSW - Intercepted ort .mjs request");

    try {
      const response = await fetch(bypass("/ort-wasm-simd-threaded.jsep.mjs"));

      if (!response.ok) {
        console.error("Failed to fetch local .mjs:", response.status);
        // Fall back to passthrough if local file missing
        return passthrough();
      }

      const text = await response.text();
      console.log("MJS file size:", text.length);

      return new HttpResponse(text, {
        headers: {
          "Content-Type": "text/javascript",
        },
      });
    } catch (error) {
      console.error("Error loading local .mjs:", error);
      return passthrough();
    }
  },
);

const ortWasm = http.get(
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0-dev.20250206-d981b153d3/dist/ort-wasm-simd-threaded.jsep.wasm",
  async () => {
    const mockWasm = await fetch(bypass("/ort-wasm-simd-threaded.jsep.wasm"));
    const buffer = await mockWasm.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: { "Content-Type": "application/wasm" },
    });
  },
);

export const handlers = [
  espeak,
  ffmpeg,
  ffmpegCore,
  kokoro,
  kokoroSmall,
  ortCore,
  ortWasm,
];
