import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	OffthreadVideo,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, F} from './theme';

const NOISE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url("${NOISE}")`,
				backgroundPosition: `${(f * 37) % 220}px ${(f * 53) % 220}px`,
				opacity,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
			}}
		/>
	);
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
		}}
	/>
);

/** Full-frame footage with slow push-in. Clips are pre-trimmed, so playback starts at 0. */
export const Footage: React.FC<{
	src: string;
	dur: number;
	zoom?: [number, number];
	letterbox?: boolean;
	dim?: number;
	pos?: string;
	volume?: number;
}> = ({src, dur, zoom = [1.03, 1.1], letterbox = false, dim = 0, pos = 'center', volume = 0}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, dur], zoom, {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${s})`}}>
				<OffthreadVideo
					src={staticFile(src)}
					volume={volume}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}}
				/>
			</AbsoluteFill>
			{dim > 0 && <AbsoluteFill style={{background: `rgba(5,4,5,${dim})`}} />}
			{letterbox && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 139, background: C.ink}} />
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 139, background: C.ink}} />
				</>
			)}
		</AbsoluteFill>
	);
};

/** Line of text that slides up out of a mask. */
export const Reveal: React.FC<{
	delay?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	out?: number;
}> = ({delay = 0, children, style, out}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: f - delay, fps, config: {damping: 200, mass: 0.7}});
	let y = interpolate(p, [0, 1], [105, 0]);
	if (out !== undefined) {
		const q = interpolate(f, [out, out + 10], [0, -105], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.in(Easing.cubic),
		});
		if (f >= out) y = q;
	}
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.08em'}}>
			<div style={{transform: `translateY(${y}%)`, ...style}}>{children}</div>
		</div>
	);
};

export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
	children,
	color = C.paper,
	size = 20,
	style,
}) => (
	<div
		style={{
			fontFamily: F.ui,
			fontWeight: 600,
			fontSize: size,
			letterSpacing: '0.14em',
			textTransform: 'uppercase',
			color,
			...style,
		}}
	>
		{children}
	</div>
);

export const Dot: React.FC<{size?: number; glow?: boolean}> = ({size = 12, glow = true}) => (
	<span
		style={{
			display: 'inline-block',
			width: size,
			height: size,
			borderRadius: '50%',
			background: C.pink,
			boxShadow: glow ? `0 0 ${size * 1.6}px ${C.pink}` : 'none',
		}}
	/>
);

export const fmt = (n: number) => {
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/0$/, '') + 'M';
	if (n >= 1000) return Math.round(n / 1000) + 'K';
	return Math.round(n).toLocaleString('en-US');
};

export const Counter: React.FC<{to: number; delay?: number; dur?: number; suffix?: string; style?: React.CSSProperties}> = ({
	to,
	delay = 0,
	dur = 40,
	suffix = '',
	style,
}) => {
	const f = useCurrentFrame();
	const v = interpolate(f, [delay, delay + dur], [0, to], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{fmt(v) + suffix}</span>;
};

export const SECTIONS = ['On camera', 'Live events', 'In game', 'GG Clan', 'Omchain', 'Contact'];

/** The "Index" list from the website: active row lights up with a pink dot. */
export const IndexCard: React.FC<{active: number; dur?: number}> = ({active, dur = 54}) => {
	const f = useCurrentFrame();
	const op = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: op}}>
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,4,5,.88) 0%, rgba(5,4,5,.55) 45%, rgba(5,4,5,0) 75%)'}} />
			<div style={{position: 'absolute', left: 110, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2}}>
				{SECTIONS.map((s, i) => {
					const on = i === active;
					const lift = on ? interpolate(f, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
					return (
						<div
							key={s}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 22,
								fontFamily: F.ui,
								fontWeight: 200,
								fontSize: 66,
								letterSpacing: '-0.02em',
								lineHeight: 1.08,
								color: on ? C.paper : C.dim,
								transform: `translateX(${lift * 18}px)`,
							}}
						>
							<span style={{width: 14, display: 'inline-flex', transform: `scale(${lift})`}}>
								<Dot size={14} />
							</span>
							{s}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const Thumb: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
	<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style}} />
);
