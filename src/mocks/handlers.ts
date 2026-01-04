import { bypass, http, HttpResponse, passthrough } from "msw";

async function serveStaticFile(buffer: ArrayBuffer, contentType: string) {
  return HttpResponse.arrayBuffer(buffer, {
    headers: { "Content-Type": contentType },
  });
}

// Helper that works both server and client side
async function loadFile(filename: string, contentType: string) {
  // Server-side: use fs
  if (typeof window === "undefined") {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const data = await readFile(join(process.cwd(), "static", filename));
    const buffer = Buffer.from(data).buffer;
    // new Uint8Array(data).buffer;

    return serveStaticFile(buffer, contentType);
  }

  // Client-side: fetch from static
  const response = await fetch(bypass(`/${filename}`));
  const responseBuffer = await response.arrayBuffer();
  return serveStaticFile(responseBuffer, contentType);
}

const espeak = http.get(
  "https://cdn.jsdelivr.net/npm/espeak-ng@1.0.2/dist/espeak-ng.wasm",
  () => loadFile("espeak-ng.wasm", "application/wasm"),
);
const voice = http.get(
  "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/voices/af_heart.bin",
  () => loadFile("af_heart.bin", "application/octet-stream"),
);

const ffmpeg = http.get(
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm",
  () => loadFile("ffmpeg-core.wasm", "application/wasm"),
);

const ffmpegCore = http.get(
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js",
  () => loadFile("ffmpeg-core.js", "application/javascript"),

  // {
  //   const response = await fetch(bypass("/ffmpeg-core.js"));
  //   const text = await response.text();
  //   console.log("MJS file size:", text.length);
  //
  //   return HttpResponse.text(text, {
  //     headers: { "Content-Type": "application/javascript" },
  //   });
  // },
);

const kokoro = http.get(
  "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/onnx/model.onnx",
  () => loadFile("model.onnx", "application/wasm"),
);

const kokoroSmall = http.get(
  "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/onnx/model_q8f16.onnx",
  () => loadFile("model_q8f16.onnx", "application/wasm"),
);

const ortCore = http.get(
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0-dev.20250206-d981b153d3/dist/ort-wasm-simd-threaded.jsep.mjs",
  () => loadFile("ort-wasm-simd-threaded.jsep.mjs", "text/javascript"),
);

const ortWasm = http.get(
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0-dev.20250206-d981b153d3/dist/ort-wasm-simd-threaded.jsep.wasm",
  () => loadFile("ort-wasm-simd-threaded.jsep.wasm", "application/wasm"),
);

const notyf = http.get(
  "https://cdn.jsdelivr.net/npm/notyf@3.10.0/notyf.min.css",
  () => loadFile("notyf.min.css", "text/css"),
);

export const handlers = [
  espeak,
  ffmpeg,
  ffmpegCore,
  kokoro,
  kokoroSmall,
  ortCore,
  ortWasm,
  voice,
  notyf,
];
