import os
import subprocess
import whisper
from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_video_id(url: str) -> str:
    return url.split("v=")[-1].split("&")[0]

def get_subtitles(video_id: str):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        return " ".join([entry["text"] for entry in transcript])
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

def download_audio(url: str):
    subprocess.run([
        "yt-dlp", "-x", "--audio-format", "mp3", "-o", "audio.%(ext)s", url
    ])

def transcribe_audio():
    model = whisper.load_model("base")
    result = model.transcribe("audio.mp3")
    return result["text"]

def summarize_with_openai(text: str):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes educational video transcripts."},
            {"role": "user", "content": f"Here is a video transcript:\n\n{text}\n\nSummarize it briefly and list clear action points for learning."}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content

@app.route("/api/summarize", methods=["POST"])
def summarize():
    data = request.json
    url = data.get("videoUrl")
    if not url:
        return jsonify({"error": "videoUrl is required"}), 400

    video_id = get_video_id(url)
    transcript = get_subtitles(video_id)

    if not transcript:
        download_audio(url)
        transcript = transcribe_audio()

    summary = summarize_with_openai(transcript)
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)