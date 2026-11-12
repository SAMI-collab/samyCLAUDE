import sys, cv2, numpy as np, subprocess, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
src, bgp, model, out = sys.argv[1:5]
W, H = 1080, 1920
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
bg = cv2.imread(bgp); bh, bw = bg.shape[:2]; s = max(W/bw, H/bh)
bg = cv2.resize(bg, (int(bw*s)+1, int(bh*s)+1)); y0=(bg.shape[0]-H)//2; x0=(bg.shape[1]-W)//2
bg = bg[y0:y0+H, x0:x0+W]; bg = cv2.GaussianBlur(bg, (0,0), 6); bg = (bg*0.8).astype(np.uint8)
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=BaseOptions(model_asset_path=model), running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True))
ff = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(fps),'-i','-',
    '-i',src,'-map','0:v','-map','1:a?','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-c:a','aac','-shortest',out], stdin=subprocess.PIPE)
prev=None; i=0
while True:
    ok, fr = cap.read()
    if not ok: break
    h, w = fr.shape[:2]; s = max(W/w, H/h)
    fr = cv2.resize(fr, (int(w*s)+1, int(h*s)+1)); yy=(fr.shape[0]-H)//2; xx=(fr.shape[1]-W)//2; fr = fr[yy:yy+H, xx:xx+W]
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(fr, cv2.COLOR_BGR2RGB))
    r = seg.segment_for_video(img, int(i*1000/fps))
    m = 1 - r.confidence_masks[0].numpy_view().astype(np.float32)
    m = cv2.resize(m, (W, H))
    if prev is not None: m = 0.6*m + 0.4*prev
    prev = m
    m = np.clip((m-0.3)/0.4, 0, 1); m = cv2.GaussianBlur(m, (0,0), 2)[..., None]
    ff.stdin.write((fr*m + bg*(1-m)).astype(np.uint8).tobytes()); i += 1
ff.stdin.close(); ff.wait(); print('frames', i)
