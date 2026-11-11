import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

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

const ROUTES: [number, number, number, number][] = [
  [300, 380, 500, 130], [520, 330, 500, 130], [640, 260, 500, 130], [700, 150, 220, 150],
  [520, 250, 220, 150], [780, 270, 850, 390], [180, 230, 220, 150], [520, 330, 640, 260],
  [700, 150, 850, 390], [300, 350, 500, 130], [640, 260, 220, 150], [500, 130, 850, 390],
];

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

// Scène 1 : le départ
const Scene1 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: frame - 6, fps, config: {damping: 12}});
  const t = interpolate(frame, [20, 40], [0, 1], clamp);
  const out = interpolate(frame, [80, 90], [1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
      {[0, 1].map((k) => {
        const w = ((frame + k * 30) % 60) / 60;
        return <div key={k} style={{position: 'absolute', width: 40 + w * 260, height: 40 + w * 260, borderRadius: '50%', border: `3px solid ${C.corail}`, opacity: (1 - w) * s * 0.7}} />;
      })}
      <div style={{width: 40, height: 40, borderRadius: '50%', background: C.corail, transform: `scale(${s})`, boxShadow: `0 0 60px ${C.corail}`}} />
      <Text size={120} weight={800} style={{position: 'absolute', top: 1120, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>Partir.</Text>
    </AbsoluteFill>
  );
};

// Scène 2 : les trajets
const Scene2 = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 40], [3, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const words = 'Chaque année, des millions de personnes changent de pays.'.split(' ');
  return (
    <AbsoluteFill>
      <WorldMap opacity={1} routes={1} scale={zoom} />
      <Text size={70} weight={700} style={{position: 'absolute', top: 300}}>
        {words.map((w, i) => (
          <span key={i} style={{opacity: interpolate(frame, [20 + i * 3, 26 + i * 3], [0, 1], clamp)}}>{w} </span>
        ))}
      </Text>
    </AbsoluteFill>
  );
};

// Scène 3 : le chiffre
const Scene3 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const n = Math.round(interpolate(frame, [5, 50], [0, 281], {...clamp, easing: Easing.out(Easing.cubic)}));
  const bump = 1 + 0.08 * spring({frame: frame - 50, fps, config: {damping: 10}}) * interpolate(frame, [50, 70], [1, 0], clamp);
  const sub = interpolate(frame, [60, 75], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <WorldMap opacity={0.1} routes={0} />
      <Text size={160} weight={800} color={C.turquoise} style={{transform: `scale(${bump})`}}>{n} millions</Text>
      <Text size={60} style={{marginTop: 30, opacity: sub}}>de migrants internationaux dans le monde</Text>
      <Text size={32} style={{marginTop: 40, opacity: sub * 0.6}}>Source : ONU / OIM, 2020</Text>
    </AbsoluteFill>
  );
};

// Scène 4 : des visages
const PALETTE = [C.corail, C.turquoise, C.sable];
const Person: React.FC<{color: string; s: number; kid?: boolean}> = ({color, s, kid}) => (
  <svg viewBox="0 0 100 140" width={kid ? 150 : 200} height={kid ? 210 : 280} style={{transform: `scale(${s})`, alignSelf: 'flex-end'}}>
    <circle cx={50} cy={32} r={24} fill={color} />
    <path d="M10,140 Q10,66 50,66 Q90,66 90,140 Z" fill={color} />
  </svg>
);
const Scene4 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const lines = ['Des étudiants.', 'Des soignants.', 'Des familles.'];
  const out = interpolate(frame, [125, 135], [1, 0], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', opacity: out}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 30, marginTop: 300}}>
        {Array.from({length: 9}).map((_, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'center', height: 290}}>
            <Person color={PALETTE[i % 3]} kid={i === 4 || i === 6} s={spring({frame: frame - i * 4, fps, config: {damping: 14}})} />
          </div>
        ))}
      </div>
      <div style={{marginTop: 80}}>
        {lines.map((l, i) => (
          <Text key={i} size={64} weight={700} style={{opacity: interpolate(frame, [20 + i * 25, 35 + i * 25], [0, 1], clamp), marginBottom: 16}}>{l}</Text>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scène 5 : conclusion
const Scene5 = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const map = interpolate(frame, [0, 20], [0, 1], clamp);
  const s = spring({frame: frame - 15, fps, config: {damping: 200}});
  const fade = interpolate(frame, [65, 75], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <WorldMap opacity={map * 0.5} routes={0} />
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <Text size={80} weight={800} style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`, marginTop: -500}}>
          Derrière chaque trajet,<br /><span style={{color: C.corail}}>une histoire.</span>
        </Text>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Immigration = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    <Sequence durationInFrames={90}><Scene1 /></Sequence>
    <Sequence from={90} durationInFrames={150}><Scene2 /></Sequence>
    <Sequence from={240} durationInFrames={150}><Scene3 /></Sequence>
    <Sequence from={390} durationInFrames={135}><Scene4 /></Sequence>
    <Sequence from={525} durationInFrames={75}><Scene5 /></Sequence>
  </AbsoluteFill>
);
