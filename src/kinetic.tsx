import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Footage, Label} from './components';
import {C, F} from './theme';

/** Full-screen slam word (style 03). A pink flash on the first frames, then a hard settle. */
export const Word: React.FC<{text: string; dur: number; flash?: 'pink' | 'white' | 'none'; size?: number}> = ({
	text,
	dur,
	flash = 'pink',
	size = 250,
}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 5, dur], [1.18, 1.0, 0.97], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const flashOn = flash !== 'none' && f < 2;
	const bg = flashOn ? (flash === 'pink' ? C.pink : C.paper) : C.ink;
	const fg = flashOn ? C.ink : C.paper;
	const parts = text.split('.');
	return (
		<AbsoluteFill style={{background: bg, justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					fontFamily: F.ui,
					fontWeight: 900,
					fontSize: size,
					lineHeight: 0.84,
					letterSpacing: '-0.055em',
					textTransform: 'uppercase',
					textAlign: 'center',
					color: fg,
					transform: `scale(${s})`,
					whiteSpace: 'pre-line',
				}}
			>
				{parts[0]}
				{parts.length > 1 && <span style={{color: flashOn ? C.ink : C.pink}}>.</span>}
			</div>
		</AbsoluteFill>
	);
};

/** Section opener: giant word with a pink rule wiping under it and a small section label. */
export const Chapter: React.FC<{text: string; label: string; dur: number}> = ({text, label, dur}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 6], [1.12, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const w = interpolate(f, [3, 16], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = interpolate(f, [dur - 4, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: f < 2 ? C.pink : C.ink, justifyContent: 'center', alignItems: 'center', opacity: out}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, transform: `scale(${s})`}}>
				<Label color={C.pink} size={24}>
					{label}
				</Label>
				<div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 210, lineHeight: 0.84, letterSpacing: '-0.055em', textTransform: 'uppercase', color: C.paper}}>
					{text}
				</div>
				<div style={{height: 10, width: `${w}%`, background: C.pink, boxShadow: `0 0 30px ${C.pink}`}} />
			</div>
		</AbsoluteFill>
	);
};

/** Footage with a huge knock-out word over it (difference blend), used for event roles and game beats. */
export const KnockClip: React.FC<{src: string; dur: number; word: string; size?: number; align?: 'left' | 'center'}> = ({
	src,
	dur,
	word,
	size = 190,
	align = 'left',
}) => {
	const f = useCurrentFrame();
	const x = interpolate(f, [0, 5], [-40, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const shake = f < 3 ? (f % 2 === 0 ? 8 : -8) : 0;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${shake}px, ${-shake / 2}px)`}}>
				<Footage src={src} dur={dur} zoom={[1.08, 1.14]} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: align === 'left' ? 'flex-end' : 'center',
					alignItems: align === 'left' ? 'flex-start' : 'center',
					padding: '0 0 70px 80px',
					mixBlendMode: 'difference',
				}}
			>
				<div
					style={{
						fontFamily: F.ui,
						fontWeight: 900,
						fontSize: size,
						lineHeight: 0.82,
						letterSpacing: '-0.055em',
						textTransform: 'uppercase',
						color: '#fff',
						transform: `translateX(${x}px)`,
						whiteSpace: 'pre-line',
					}}
				>
					{word}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** One-frame white or pink flash. */
export const Flash: React.FC<{color?: string}> = ({color = C.paper}) => <AbsoluteFill style={{background: color}} />;
