import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring} from 'remotion';

// Style « podcast » : vidéo face caméra + accroche fixe en haut + sous-titres jaunes au centre
export type Ligne = {debut: number; fin: number; texte: string};
export type PodcastProps = {video: string; accroche: string; lignes: Ligne[]; duree: number};
const FONT = '"DejaVu Sans", Inter, Arial, sans-serif';

const Sous: React.FC<{t: string}> = ({t}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}, durationInFrames: 8});
  return (
    <div style={{position: 'absolute', top: 1420, left: 50, right: 50, textAlign: 'center', direction: 'rtl', fontFamily: FONT,
      fontSize: 74, fontWeight: 800, color: '#FFE600', lineHeight: 1.25, transform: `scale(${0.85 + 0.15 * s})`,
      WebkitTextStroke: '3px #000', paintOrder: 'stroke fill', textShadow: '0 4px 12px rgba(0,0,0,.7)'}}>{t}</div>
  );
};

export const Podcast: React.FC<PodcastProps> = ({video, accroche, lignes}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(60,60,60,0.85)', padding: '14px 30px', borderRadius: 10, direction: 'rtl', fontFamily: FONT,
          fontSize: 58, fontWeight: 800, color: '#FFE600', WebkitTextStroke: '2px #000', paintOrder: 'stroke fill'}}>{accroche}</div>
      </div>
      {lignes.map((l, i) => (
        <Sequence key={i} from={Math.round(l.debut * fps)} durationInFrames={Math.max(1, Math.round((l.fin - l.debut) * fps))}><Sous t={l.texte} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
