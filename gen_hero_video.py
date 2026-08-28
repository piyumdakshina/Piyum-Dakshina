import os
import sys
import time
import base64

from google import genai

ROOT = os.path.dirname(os.path.abspath(__file__))
FRAME = os.path.join(ROOT, "docs", "f6f8fc93-68b5-45d3-bbe6-be197d13af8f.png")
OUT = os.path.join(ROOT, "piyumverse", "public", "hero-video.mp4")

PROMPT = (
    "Cinematic 9:16 close-up portrait of an 18-year-old Sri Lankan man with short black hair "
    "and warm brown eyes. He is holding still, then slowly turns his head to face the camera, "
    "holds eye contact and gives a gentle, confident smile. Perfectly stable camera, soft natural "
    "light, dark clean background, shallow depth of field, photorealistic, film grain, high fidelity "
    "to the person in the image. Single continuous shot, no cuts, no text, no watermark."
)


def main():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("GEMINI_API_KEY not set")
        sys.exit(1)

    client = genai.Client(api_key=key)

    with open(FRAME, "rb") as f:
        frame_b64 = base64.b64encode(f.read()).decode()

    request = dict(
        model="gemini-omni-flash-preview",
        input=[
            {"type": "image", "data": frame_b64, "mime_type": "image/png"},
            {"type": "text", "text": PROMPT},
        ],
        generation_config={"video_config": {"task": "image_to_video"}},
        response_format={"type": "video", "aspect_ratio": "9:16", "duration": "8s"},
    )

    print("Generating hero video (Omni Flash, free tier)...")

    attempt = 0
    while True:
        attempt += 1
        try:
            interaction = client.interactions.create(**request)
            video = interaction.output_video
            if not video or not video.data:
                uri = getattr(video, "uri", None)
                if uri:
                    print("Video returned as URI, downloading...")
                    data = client.files.download(file=uri)
                    os.makedirs(os.path.dirname(OUT), exist_ok=True)
                    with open(OUT, "wb") as f:
                        f.write(data)
                    print(f"Saved -> {OUT}")
                    return
                raise RuntimeError(f"no video content in response: {video!r}")
            os.makedirs(os.path.dirname(OUT), exist_ok=True)
            with open(OUT, "wb") as f:
                f.write(base64.b64decode(video.data))
            print(f"Saved -> {OUT}")
            return
        except Exception as exc:
            msg = str(exc)
            print(f"  attempt {attempt} failed: {type(exc).__name__}: {msg}")
            delay = 60
            try:
                idx = msg.find("seconds")
                if idx != -1:
                    head = msg[:idx]
                    n = head.rstrip(" .").split()[-1]
                    delay = int(''.join(c for c in n if c.isdigit())) + 2
            except Exception:
                pass
            if "429" in msg and attempt >= 30:
                print("giving up after 30 attempts (quota/rate limited)")
                sys.exit(2)
            if attempt >= 30:
                print("giving up after 30 attempts")
                sys.exit(2)
            print(f"  waiting {delay}s...")
            time.sleep(delay)


if __name__ == "__main__":
    main()