import React from 'react';
import {Composition} from 'remotion';
import {Showreel, TOTAL} from './Showreel';

export const Root: React.FC = () => (
	<Composition id="Showreel" component={Showreel} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
