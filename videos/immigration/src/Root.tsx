import {Composition} from 'remotion';
import {Immigration} from './Immigration';
import {DZ} from './DZ';
import {Reel} from './Reel';
import {Podcast} from './Podcast';
import {exemple} from './reel-exemple';
export const Root = () => (
  <>
  <Composition id="Immigration" component={Immigration} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="EntreeExpressDZ" component={DZ} durationInFrames={1350} fps={30} width={1080} height={1920} />
    <Composition id="Reel" component={Reel} defaultProps={exemple} durationInFrames={450}
      calculateMetadata={({props}) => ({durationInFrames: Math.round(((props as any).duree ?? 15) * 30)})} fps={30} width={1080} height={1920} />
    <Composition id="Podcast" component={Podcast} defaultProps={{video: 'v3-detoure.mp4', accroche: '', lignes: [], duree: 10}} durationInFrames={300} fps={30} width={1080} height={1920}
      calculateMetadata={({props}) => ({durationInFrames: Math.round((props as any).duree * 30)})} />
  </>
);
