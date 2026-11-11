import React from 'react';
import {Audio, staticFile, AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const C = {nuit: '#0B1220', sable: '#F2E8D5', corail: '#FF6B4A', turquoise: '#2EC4B6'};
const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Carte stylisée : continents approximés par des ellipses (repère 1000x500)
const CONT: [number, number, number, number][] = [
  [220, 150, 120, 80], [180, 230, 60, 50], [300, 350, 60, 110], // Amériques
  [500, 130, 60, 45], [520, 290, 85, 120], // Europe, Afrique
  [700, 150, 180, 90], [640, 260, 50, 40], [780, 270, 50, 40], // Asie
  [850, 390, 60, 40], // Océanie
];
const DOTS: [number, number][] = [];
for (let x = 0; x < 1000; x += 18)
  for (let y = 0; y < 500; y += 18)
    if (CONT.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1)) DOTS.push([x, y]);

const CA: [number, number] = [210, 120];
const ROUTES: [number, number, number, number][] = [
  [500, 130], [520, 330], [640, 260], [700, 150], [780, 270], [850, 390],
  [300, 380], [180, 230], [560, 230], [740, 120], [480, 200], [620, 300],
].map(([x, y]) => [x, y, CA[0], CA[1]] as [number, number, number, number]);

const MAP_W = 1080, MAP_H = 540, MAP_Y = 690;

const WorldMap: React.FC<{opacity: number; routes: number; scale?: number}> = ({opacity, routes, scale = 1}) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1000 500" style={{position: 'absolute', left: 0, top: MAP_Y, width: MAP_W, height: MAP_H, transform: `scale(${scale})`, opacity}}>
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill={C.sable} opacity={0.3} />)}
      {ROUTES.map(([x1, y1, x2, y2], i) => {
        const p = routes ? interpolate(frame, [i * 6, i * 6 + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
        const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 60 - Math.abs(x2 - x1) * 0.15;
        const len = 1400;
        return (
          <g key={i}>
            <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={i % 2 ? C.turquoise : C.corail}
              strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
            <circle cx={x1} cy={y1} r={7} fill={i % 2 ? C.turquoise : C.corail} opacity={p > 0 ? 1 : 0} />
          </g>
        );
      })}
    </svg>
  );
};

const Text: React.FC<{children: React.ReactNode; size: number; color?: string; weight?: number; style?: React.CSSProperties}> =
  ({children, size, color = C.sable, weight = 500, style}) => (
    <div style={{fontFamily: FONT, fontSize: size, color, fontWeight: weight, textAlign: 'center', lineHeight: 1.15, padding: '0 80px', ...style}}>{children}</div>
  );


const RED = '#E63946';
const Leaf: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <svg viewBox="-50 -55 100 110" width={size} height={size} style={style}>
    <path fill={RED} d="M0,-50 L8,-32 L18,-38 L14,-14 L30,-24 L28,-14 L46,-16 L38,0 L46,6 L22,22 L26,32 L4,28 L4,52 L-4,52 L-4,28 L-26,32 L-22,22 L-46,6 L-38,0 L-46,-16 L-28,-14 L-30,-24 L-14,-14 L-18,-38 L-8,-32 Z" />
  </svg>
);

// Scène 1 : accroche
const Scene1 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 12}});
  const t = interpolate(frame, [15, 35], [0, 1], clamp);
  const out = interpolate(frame, [80, 90], [1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
      <Leaf size={300} style={{transform: `scale(${s}) rotate(${(1 - s) * -30}deg)`, filter: `drop-shadow(0 0 40px ${RED})`}} />
      <Text size={110} weight={800} style={{position: 'absolute', top: 1200, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
        Vous rêvez du <span style={{color: RED}}>Canada</span> ?
      </Text>
    </AbsoluteFill>
  );
};

// Scène 2 : Entrée express
const Scene2 = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 40], [2.2, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const words = 'Le système fédéral pour immigrer comme travailleur qualifié.'.split(' ');
  return (
    <AbsoluteFill>
      <Text size={110} weight={800} color={C.turquoise} style={{position: 'absolute', top: 260, width: '100%', boxSizing: 'border-box'}}>Entrée express</Text>
      <Text size={60} weight={600} style={{position: 'absolute', top: 420, width: '100%', boxSizing: 'border-box'}}>
        {words.map((w, i) => <span key={i} style={{opacity: interpolate(frame, [10 + i * 4, 16 + i * 4], [0, 1], clamp)}}>{w} </span>)}
      </Text>
      <WorldMap opacity={1} routes={1} scale={zoom} />
    </AbsoluteFill>
  );
};

// Scène 3 : trois programmes
const Scene3 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const items: [string, string, string][] = [
    ['1', 'Travailleurs qualifiés (fédéral)', C.corail],
    ['2', 'Métiers spécialisés (fédéral)', C.turquoise],
    ['3', 'Expérience canadienne', C.sable],
  ];
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
      <Text size={84} weight={800}>3 programmes</Text>
      {items.map(([n, label, col], i) => {
        const s = spring({frame: frame - 15 - i * 25, fps, config: {damping: 16}});
        return (
          <div key={n} style={{marginTop: 60, width: 880, display: 'flex', alignItems: 'center', gap: 40, padding: '44px 50px', borderRadius: 32,
            background: 'rgba(242,232,213,0.07)', border: `3px solid ${col}`, opacity: s, transform: `translateX(${(1 - s) * 300}px)`}}>
            <div style={{fontFamily: FONT, fontSize: 90, fontWeight: 800, color: col}}>{n}</div>
            <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.sable}}>{label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scène 4 : les étapes
const Scene4 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const steps = ['Créez votre profil', 'Obtenez votre score CRS', 'Recevez une invitation', 'Résidence permanente'];
  const out = interpolate(frame, [125, 135], [1, 0], clamp);
  const line = interpolate(frame, [5, 100], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: out, paddingTop: 360, paddingLeft: 140}}>
      <div style={{position: 'absolute', left: 179, top: 420, width: 6, height: 900 * line, background: C.turquoise}} />
      {steps.map((st, i) => {
        const s = spring({frame: frame - 5 - i * 28, fps, config: {damping: 14}});
        const last = i === steps.length - 1;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 50, height: 300, opacity: s}}>
            <div style={{width: 84, height: 84, borderRadius: '50%', background: last ? RED : C.turquoise, transform: `scale(${s})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 800, color: C.nuit}}>{i + 1}</div>
            <div style={{fontFamily: FONT, fontSize: 60, fontWeight: 700, color: last ? RED : C.sable, maxWidth: 700}}>{st}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scène 5 : conclusion
const Scene5 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: frame - 3, fps, config: {damping: 200}});
  const fade = interpolate(frame, [65, 75], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', alignItems: 'center'}}>
      <Leaf size={200} style={{transform: `scale(${s})`, marginBottom: 60}} />
      <Text size={96} weight={800} style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
        Votre avenir<br /><span style={{color: RED}}>commence ici.</span>
      </Text>
      <Text size={40} style={{marginTop: 50, opacity: s * 0.7}}>canada.ca/entree-express</Text>
    </AbsoluteFill>
  );
};

const VO: [number, string][] = [[3, 'e1.wav'], [93, 'e2.wav'], [242, 'e3.wav'], [393, 'e4.wav']];

export const Immigration = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    <Sequence durationInFrames={90}><Scene1 /></Sequence>
    <Sequence from={90} durationInFrames={150}><Scene2 /></Sequence>
    <Sequence from={240} durationInFrames={150}><Scene3 /></Sequence>
    <Sequence from={390} durationInFrames={135}><Scene4 /></Sequence>
    <Sequence from={525} durationInFrames={75}><Scene5 /></Sequence>
    {VO.map(([f, file]) => <Sequence key={file} from={f}><Audio src={staticFile(file)} /></Sequence>)}
  </AbsoluteFill>
);
