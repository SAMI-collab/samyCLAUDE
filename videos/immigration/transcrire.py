"""Transcrit une voix avec Whisper et affiche les phrases au format du modèle Reel.
Usage : python3 transcrire.py voix.mp3 [langue]   (langue : fr, ar... ; par défaut détection auto)"""
import sys, json, whisper
m = whisper.load_model('small')
r = m.transcribe(sys.argv[1], language=sys.argv[2] if len(sys.argv) > 2 else None)
print('phrases: [')
for s in r['segments']:
    print(f"  {{debut: {s['start']:.1f}, fin: {s['end']:.1f}, texte: {json.dumps(s['text'].strip(), ensure_ascii=False)}}},")
print(']')
