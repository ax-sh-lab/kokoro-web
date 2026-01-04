```sh 
curl -X POST "http://localhost:8880/api/v1/audio/speech" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-kokoro-api-key" \
  -d '{
    "model": "model_q8f16",
    "voice": "af_heart",
    "input": "Today is a wonderful day to build something people love!"
  }' \
  --output speech.mp3
```