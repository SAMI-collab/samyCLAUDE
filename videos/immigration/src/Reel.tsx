import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Leaf, RED} from './Immigration';

// Modèle réutilisable : fond qui défile + titre + sous-titres « machine à écrire » + voix off
export type Phrase = {debut: number; fin: number; texte: string};
export type ReelProps = {
  fond: string; fondEstVideo?: boolean; titre: string; sousTitre: string; marque: string;
  voix?: string; phrases: Phrase[];
};

const FONT = 'Inter, "DejaVu Sans", Arial, sans-serif';
const shadow = '0 3px 10px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)';

const Fond: React.FC<{src: string; video?: boolean}> = ({src, video}) => {
  const f = useCurrentFrame(), {durationInFrames} = useVideoConfig();
  const s = interpolate(f, [0, durationInFrames], [1.15, 1.3]);
  const x = interpolate(f, [0, durationInFrames], [0, -60]);
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s}) translateX(${x}px)`};
  return video ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : <Img src={staticFile(src)} style={st} />;
};

const SousTitre: React.FC<{p: Phrase}> = ({p}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const dur = (p.fin - p.debut) * fps;
  const n = Math.round(interpolate(f, [0, dur * 0.85], [0, p.texte.length], {extrapolateRight: 'clamp'}));
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', top: 1020, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontSize: 62, fontWeight: 800,
      color: '#fff', textShadow: shadow, lineHeight: 1.3, direction: /[؀-ۿ]/.test(p.texte) ? 'rtl' : 'ltr'}}>
      {p.texte.slice(0, n)}
      <span style={{display: 'inline-block', width: 14, height: 64, background: '#fff', marginInline: 8, verticalAlign: 'middle', opacity: blink ? 1 : 0}} />
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({fond, fondEstVideo, titre, sousTitre, marque, voix, phrases}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill><Fond src={fond} video={fondEstVideo} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)'}} />
      {/* marque en haut à gauche */}
      <div style={{position: 'absolute', top: 80, left: 50, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 800,
        fontSize: 34, color: '#fff', textShadow: shadow, letterSpacing: 1}}>
        <div style={{width: 46, height: 46, borderRadius: 12, background: RED, display: 'grid', placeItems: 'center'}}><Leaf size={34} style={{filter: 'brightness(10)'}} /></div>
        {marque}
      </div>
      {/* titre */}
      <div style={{position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <div style={{width: 96, height: 56, display: 'flex', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.4)'}}>
          <div style={{flex: 1, background: RED}} />
          <div style={{flex: 2, background: '#fff', display: 'grid', placeItems: 'center'}}><Leaf size={40} /></div>
          <div style={{flex: 1, background: RED}} />
        </div>
        <div style={{fontFamily: FONT, fontSize: 64, fontWeight: 800, color: '#fff', textShadow: shadow}}>{titre}</div>
        <div style={{fontFamily: FONT, fontSize: 58, fontWeight: 800, color: '#fff', textShadow: shadow, direction: 'rtl'}}>{sousTitre}</div>
      </div>
      {phrases.map((p, i) => (
        <Sequence key={i} from={Math.round(p.debut * fps)} durationInFrames={Math.round((p.fin - p.debut) * fps) + 10}><SousTitre p={p} /></Sequence>
      ))}
      {voix ? <Audio src={staticFile(voix)} /> : null}
    </AbsoluteFill>
  );
};
