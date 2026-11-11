import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, clamp, RED, Leaf, Text, WorldMap} from './Immigration';

const VERT = '#00A651';
const useIn = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping}});
};
const Fade: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [len - 10, len], [1, 0], clamp)}}>{children}</AbsoluteFill>;
};
// Sous-titre en bas (darja)
const Sub: React.FC<{lines: [number, string][]}> = ({lines}) => {
  const f = useCurrentFrame();
  const cur = [...lines].reverse().find(([t]) => f >= t);
  if (!cur) return null;
  const o = interpolate(f, [cur[0], cur[0] + 6], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', bottom: 230, left: 60, right: 60, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(0,0,0,0.55)', borderRadius: 24, padding: '22px 34px', fontFamily: FONT, fontSize: 46, fontWeight: 700,
        color: '#fff', textAlign: 'center', lineHeight: 1.25}}>{cur[1]}</div>
    </div>
  );
};

// 1. Accroche 0-3 s
const Hook = () => {
  const a = useIn(0, 12), b = useIn(12, 12), t = useIn(25, 200);
  return (
    <Fade len={90}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 50}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
          <div style={{width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', display: 'flex', position: 'relative', transform: `scale(${a})`}}>
            <div style={{flex: 1, background: VERT}} /><div style={{flex: 1, background: '#fff'}} />
            <div style={{position: 'absolute', left: 52, top: 52, width: 96, height: 96, borderRadius: '50%', background: RED}} />
            <div style={{position: 'absolute', left: 74, top: 58, width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(90deg,' + VERT + ' 50%, #fff 50%)', backgroundSize: '200px 84px', backgroundPosition: '-26px 0'}} />
            <div style={{position: 'absolute', left: 118, top: 74, fontSize: 48, lineHeight: 1, color: RED}}>★</div>
          </div>
          <div style={{fontFamily: FONT, fontSize: 120, color: C.sable, opacity: b}}>➜</div>
          <div style={{transform: `scale(${b})`}}><Leaf size={200} /></div>
        </div>
        <Text size={92} weight={800} style={{opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
          FRANÇAIS TA3EK<br />= <span style={{color: C.turquoise}}>POINTS</span>
        </Text>
      </AbsoluteFill>
      <Sub lines={[[0, 'Nta Dzayri w tahder français ?'], [45, '3andek avantage kbir f Canada !']]} />
    </Fade>
  );
};

// 2. Révélation 3-12 s
const Reveal = () => {
  const f = useCurrentFrame();
  const score = Math.round(interpolate(f, [20, 120], [0, 1200], {...clamp, easing: Easing.out(Easing.cubic)}));
  const bonus = useIn(140, 10), badge = useIn(185, 12);
  return (
    <Fade len={270}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 280}}>
        <Text size={56} weight={600} style={{opacity: 0.8}}>Score CRS : maximum</Text>
        <Text size={190} weight={800} color={C.turquoise} style={{fontVariantNumeric: 'tabular-nums'}}>{score}</Text>
        <div style={{marginTop: 40, fontFamily: FONT, fontSize: 110, fontWeight: 800, color: VERT, transform: `scale(${bonus})`}}>+50 pts</div>
        <Text size={44} style={{opacity: bonus}}>français mlih bezzaf</Text>
        <div style={{marginTop: 60, padding: '24px 44px', borderRadius: 60, background: RED, fontFamily: FONT, fontSize: 50, fontWeight: 800,
          color: '#fff', transform: `scale(${badge})`}}>Tirage francophone</div>
      </AbsoluteFill>
      <Sub lines={[[0, 'Entrée express t9eyyem b score men 1200 : CRS'], [130, 'Français mlih = hatta 50 point zyada'], [185, 'W kayen tirages ghir lel francophones !']]} />
    </Fade>
  );
};

// 3. Problème 12-25 s
const Problem = () => {
  const f = useCurrentFrame();
  const items = ['Diplôme ma t3edelch', 'Test ta3 lougha ma t7adarch', 'Preuves de fonds na9sin', 'Traductions machi conformes'];
  return (
    <Fade len={390}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
        <Text size={80} weight={800}>Win yetbelkaw<br />les dossiers ?</Text>
        <div style={{marginTop: 60, display: 'flex', flexDirection: 'column', gap: 34}}>
          {items.map((it, i) => {
            const s = interpolate(f, [30 + i * 55, 45 + i * 55], [0, 1], clamp);
            const red = f > 50 + i * 55;
            return (
              <div key={i} style={{width: 860, display: 'flex', alignItems: 'center', gap: 34, padding: '30px 40px', borderRadius: 26,
                background: 'rgba(242,232,213,0.07)', border: `3px solid ${red ? RED : 'rgba(242,232,213,0.25)'}`, opacity: s, transform: `translateX(${(1 - s) * -200}px)`}}>
                <div style={{width: 64, height: 64, borderRadius: '50%', background: red ? RED : 'transparent', border: `3px solid ${red ? RED : C.sable}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONT, fontSize: 40, fontWeight: 800}}>{red ? '✕' : ''}</div>
                <div style={{fontFamily: FONT, fontSize: 48, fontWeight: 700, color: C.sable}}>{it}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Sub lines={[[0, 'Le problème : la majorité yetbelkaw f nefs les points'], [280, 'Ghalta wa7da… w tkhesser chhour !']]} />
    </Fade>
  );
};

// 4. Solution 25-38 s
const Solution = () => {
  const f = useCurrentFrame();
  const steps = ['Calcul CRS bla drahem', 'Préparation TEF / TCF Canada', 'Montage ta3 dossier complet', 'Vérifié par consultant agréé'];
  const line = interpolate(f, [20, 300], [0, 1], clamp);
  return (
    <Fade len={390}>
      <AbsoluteFill style={{paddingTop: 260, paddingLeft: 120}}>
        <Text size={80} weight={800} color={C.turquoise} style={{textAlign: 'left', padding: 0, marginBottom: 40}}>7na nrafguek</Text>
        <div style={{position: 'absolute', left: 159, top: 440, width: 6, height: 820 * line, background: C.turquoise}} />
        {steps.map((st, i) => {
          const s = interpolate(f, [20 + i * 75, 35 + i * 75], [0, 1], clamp);
          const last = i === 3;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 44, height: 230, opacity: s}}>
              <div style={{width: 84, height: 84, borderRadius: '50%', background: last ? VERT : C.turquoise, transform: `scale(${s})`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 800, color: C.nuit}}>{last ? '✓' : i + 1}</div>
              <div style={{fontFamily: FONT, fontSize: 54, fontWeight: 700, color: last ? VERT : C.sable, maxWidth: 720}}>{st}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Sub lines={[[0, '7na nrafguek étape b étape'], [100, 'N7adrouk lel test ta3 français'], [175, 'Nwejdoulek le dossier kamel'], [250, 'Consultant agréé ychouf dossier ta3ek']]} />
    </Fade>
  );
};

// 5. Appel à l'action 38-45 s
const CTA = () => {
  const f = useCurrentFrame();
  const s = useIn(5, 10), t = useIn(30, 200);
  const pulse = 1 + 0.05 * Math.sin(f / 5);
  return (
    <Fade len={210}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40}}>
        <Text size={64} weight={700}>Ekteb f DM :</Text>
        <div style={{padding: '34px 80px', borderRadius: 40, background: RED, fontFamily: FONT, fontSize: 130, fontWeight: 800, color: '#fff',
          letterSpacing: 6, transform: `scale(${s * pulse})`, boxShadow: `0 0 80px ${RED}`}}>CANADA</div>
        <Text size={50} style={{opacity: t}}>Calcul ta3 score bla drahem f 48 sa3a</Text>
        <Text size={84} weight={800} style={{opacity: t, marginTop: 40}}>L'avenir ta3ek<br /><span style={{color: C.turquoise}}>yebda b ra9m.</span></Text>
        <Text size={30} style={{opacity: t * 0.6, marginTop: 30}}>Dossiers vérifiés par un consultant réglementé (CRIC)</Text>
      </AbsoluteFill>
    </Fade>
  );
};

export const DZ = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    <AbsoluteFill style={{opacity: 0.12}}><WorldMap opacity={1} routes={0} /></AbsoluteFill>
    <Sequence durationInFrames={90}><Hook /></Sequence>
    <Sequence from={90} durationInFrames={270}><Reveal /></Sequence>
    <Sequence from={360} durationInFrames={390}><Problem /></Sequence>
    <Sequence from={750} durationInFrames={390}><Solution /></Sequence>
    <Sequence from={1140} durationInFrames={210}><CTA /></Sequence>
  </AbsoluteFill>
);
