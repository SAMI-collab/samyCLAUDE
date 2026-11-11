import {Composition} from 'remotion';
import {Immigration} from './Immigration';
export const Root = () => (
  <Composition id="Immigration" component={Immigration} durationInFrames={600} fps={30} width={1080} height={1920} />
);
