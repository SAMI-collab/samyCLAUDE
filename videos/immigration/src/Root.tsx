import {Composition} from 'remotion';
import {Immigration} from './Immigration';
import {DZ} from './DZ';
export const Root = () => (
  <>
  <Composition id="Immigration" component={Immigration} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="EntreeExpressDZ" component={DZ} durationInFrames={1350} fps={30} width={1080} height={1920} />
  </>
);
