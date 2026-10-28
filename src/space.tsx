import React from 'react';
import {AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Counter, Dot, Label, Reveal, fmt} from './components';
import {C, F} from './theme';

const ease = Easing.bezier(0.5, 0, 0.2, 1);

export type Item = {video?: string; img?: string; loop?: number; label?: string; views?: number};

const Media: React.FC<{item: Item}> = ({item}) => {
	if (item.video) {
		const v = (
			<OffthreadVideo src={staticFile(item.video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		);
		return item.loop ? <Loop durationInFrames={item.loop}>{v}</Loop> : v;
	}
	return <Img src={staticFile(item.img!)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};

const Card: React.FC<{item: Item; style: React.CSSProperties; glow?: boolean}> = ({item, style, glow}) => (
	<div
		style={{
			position: 'absolute',
			overflow: 'hidden',
			borderRadius: 14,
			border: `1.5px solid ${glow ? C.pink : 'rgba(244,240,242,.18)'}`,
			boxShadow: glow ? `0 0 60px rgba(255,45,135,.55)` : '0 40px 90px rgba(0,0,0,.6)',
			background: '#111',
			...style,
		}}
	>
		<Media item={item} />
	</div>
);

const Space: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 60%, #1c0a14, ${C.ink} 72%)`}}>
		<AbsoluteFill style={{perspective: 2100, perspectiveOrigin: '50% 45%'}}>{children}</AbsoluteFill>
	</AbsoluteFill>
);

/** Title in depth: footage cards orbit behind the name. */
export const Title3D: React.FC<{dur: number; cards: Item[]}> = ({dur, cards}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ry = interpolate(f, [0, dur], [-16, 12], {easing: ease});
	const rx = interpolate(f, [0, dur], [5, 2]);
	const z = interpolate(f, [0, dur], [-200, 60], {easing: ease});
	const name = spring({frame: f - 6, fps, config: {damping: 200}});
	const pos: React.CSSProperties[] = [
		{width: 560, height: 315, left: 60, top: 90, transform: 'translateZ(-640px)'},
		{width: 520, height: 292, right: 60, top: 640, transform: 'translateZ(-420px)'},
		{width: 230, height: 409, right: 360, top: 40, transform: 'translateZ(-900px)'},
		{width: 440, height: 248, left: 260, top: 720, transform: 'translateZ(-300px)'},
		{width: 210, height: 373, left: 820, top: -40, transform: 'translateZ(-1100px)'},
		{width: 200, height: 356, left: -40, top: 520, transform: 'translateZ(-760px) rotateY(18deg)'},
		{width: 420, height: 236, right: -60, top: 290, transform: 'translateZ(-980px) rotateY(-14deg)'},
		{width: 190, height: 338, left: 1180, top: 760, transform: 'translateZ(-520px)'},
	];
	return (
		<Space>
			<AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`}}>
				{cards.slice(0, pos.length).map((c, i) => (
					<Card key={i} item={c} style={pos[i]} />
				))}
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: 'translateZ(160px)'}}>
					<div
						style={{
							fontFamily: F.ui,
							fontWeight: 900,
							fontSize: 250,
							letterSpacing: '-0.04em',
							lineHeight: 0.85,
							color: C.paper,
							textShadow: '0 20px 80px rgba(0,0,0,.8)',
							opacity: name,
							transform: `translateY(${(1 - name) * 40}px)`,
						}}
					>
						YUNALHOSHI
					</div>
					<div style={{marginTop: 34, display: 'flex', gap: 18, alignItems: 'center', opacity: interpolate(f, [24, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<Dot size={14} />
						<Label size={26}>On camera · In game · On brand</Label>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</Space>
	);
};

/** Tilted grid that the camera dives into, ending locked on item `focus`. */
export const Grid3D: React.FC<{
	dur: number;
	items: Item[];
	cols: number;
	aspect: number; // width / height of each card
	focus?: number;
	header?: React.ReactNode;
	stat?: {value: number; suffix?: string; label: string; delay?: number};
	kicker?: string;
	showViews?: boolean;
	glowAll?: boolean;
	children?: React.ReactNode;
}> = ({dur, items, cols, aspect, focus = 0, header, stat, kicker, showViews = true, glowAll = false, children}) => {
	const f = useCurrentFrame();
	const gap = 22;
	const gridW = cols === 6 ? 1500 : cols === 5 ? 1450 : 1380;
	const cw = (gridW - gap * (cols - 1)) / cols;
	const ch = cw / aspect;
	const rows = Math.ceil(items.length / cols);
	const gridH = rows * ch + (rows - 1) * gap;
	const fr = Math.floor(focus / cols);
	const fc = focus % cols;
	const fx = -gridW / 2 + fc * (cw + gap) + cw / 2;
	const fy = -gridH / 2 + fr * (ch + gap) + ch / 2;
	const t = interpolate(f, [0, dur * 0.85], [0, 1], {extrapolateRight: 'clamp', easing: ease});
	const rx = interpolate(t, [0, 1], [46, 14]);
	const rz = interpolate(t, [0, 1], [-11, -3]);
	const sc = interpolate(t, [0, 1], [0.82, 1.45]);
	const tx = interpolate(t, [0, 1], [0, -fx * 0.85]);
	const ty = interpolate(t, [0, 1], [80, -fy * 0.8 + 60]);
	const glowOn = f > dur * 0.45;
	return (
		<Space>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						position: 'relative',
						width: gridW,
						height: gridH,
						transformStyle: 'preserve-3d',
						transform: `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sc})`,
					}}
				>
					{header && <div style={{position: 'absolute', left: 0, top: -120, width: gridW}}>{header}</div>}
					{items.map((it, i) => {
						const r = Math.floor(i / cols);
						const c = i % cols;
						const pop = interpolate(f, [i * 2, i * 2 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
						return (
							<div key={i} style={{position: 'absolute', left: c * (cw + gap), top: r * (ch + gap), width: cw, height: ch, opacity: pop, transform: `translateZ(${(1 - pop) * -200}px)`}}>
								<Card item={it} style={{inset: 0}} glow={glowAll ? f > 6 : glowOn && i === focus} />
								{showViews && it.views !== undefined && (
									<div style={{position: 'absolute', left: 14, bottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: cw > 260 ? 30 : 24, color: C.paper, textShadow: '0 2px 10px #000'}}>
										<span style={{fontSize: '0.7em'}}>▶</span>
										{fmt(it.views)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
			{kicker && (
				<div style={{position: 'absolute', left: 90, bottom: 84, padding: '14px 22px', background: 'rgba(5,4,5,.72)', borderRadius: 999, border: '1px solid rgba(244,240,242,.14)'}}>
					<Reveal delay={4}>
						<Label color={C.paper} size={22}>
							{kicker}
						</Label>
					</Reveal>
				</div>
			)}
			{children}
			{stat && (
				<div style={{position: 'absolute', right: 90, bottom: 80, textAlign: 'right'}}>
					<div style={{fontFamily: F.ui, fontWeight: 800, fontSize: 190, letterSpacing: '-0.05em', lineHeight: 0.85, color: C.paper, textShadow: '0 10px 50px rgba(0,0,0,.8)'}}>
						<Counter to={stat.value} delay={stat.delay ?? Math.round(dur * 0.35)} dur={45} suffix={stat.suffix} />
					</div>
					<div style={{marginTop: 14}}>
						<Label size={24}>{stat.label}</Label>
					</div>
				</div>
			)}
		</Space>
	);
};

/** Three vertical videos side by side, each with its real view count. */
export const Triptych: React.FC<{dur: number; items: Item[]; kicker: string; caption: string}> = ({dur, items, kicker, caption}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<Space>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40, flexDirection: 'row', transformStyle: 'preserve-3d', transform: `rotateY(${interpolate(f, [0, dur], [8, -6])}deg)`}}>
				{items.map((it, i) => {
					const p = spring({frame: f - i * 2, fps, config: {damping: 200, mass: 0.6}});
					return (
						<div key={i} style={{position: 'relative', width: 360, height: 640, transform: `translateY(${60 + (1 - p) * 80}px) translateZ(${i === 1 ? 80 : 0}px)`, opacity: 0.4 + 0.6 * p}}>
							<Card item={it} style={{inset: 0}} glow={i === 0} />
							<div style={{position: 'absolute', left: 0, right: 0, bottom: -64, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
								<Label size={20} color={C.mute}>
									{it.label}
								</Label>
								{it.views !== undefined && (
									<span style={{fontFamily: F.ui, fontWeight: 800, fontSize: 40, letterSpacing: '-0.03em', color: C.paper}}>
										<Counter to={it.views} delay={12 + i * 6} dur={36} />
									</span>
								)}
							</div>
						</div>
					);
				})}
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 90, top: 70, display: 'grid', gap: 10}}>
				<Reveal delay={2}>
					<Label color={C.pink} size={24}>
						{kicker}
					</Label>
				</Reveal>
				<Reveal delay={6}>
					<div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 40, letterSpacing: '-0.03em', color: C.paper}}>{caption}</div>
				</Reveal>
			</div>
		</Space>
	);
};

/** Closing line floating in depth. */
export const Statement3D: React.FC<{dur: number; lines: string[]; accent?: string}> = ({dur, lines, accent}) => {
	const f = useCurrentFrame();
	const ry = interpolate(f, [0, dur], [-7, 5], {easing: ease});
	return (
		<Space>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg)`}}>
				<div style={{display: 'grid', gap: 6, textAlign: 'center'}}>
					{lines.map((l, i) => (
						<Reveal key={i} delay={6 + i * 7}>
							<div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 108, letterSpacing: '-0.045em', lineHeight: 1.02, color: l === accent ? C.pink : C.paper}}>{l}</div>
						</Reveal>
					))}
				</div>
			</AbsoluteFill>
		</Space>
	);
};

export const EndCard: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const op = interpolate(f, [dur - 20, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const z = interpolate(f, [0, dur], [-80, 40]);
	return (
		<Space>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: op, transform: `translateZ(${z}px)`}}>
				<Reveal delay={4}>
					<div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 210, letterSpacing: '-0.04em', lineHeight: 0.9, color: C.paper}}>YUNALHOSHI</div>
				</Reveal>
				<div style={{display: 'flex', gap: 16, alignItems: 'center', marginTop: 30}}>
					<Dot size={14} />
					<Reveal delay={14}>
						<Label size={26}>Host · Gaming creator · Marketer</Label>
					</Reveal>
				</div>
				<div style={{marginTop: 60}}>
					<Reveal delay={22}>
						<div style={{fontFamily: F.mono, fontSize: 40, letterSpacing: '0.04em', color: C.paper}}>github.com/yunalhoshi</div>
					</Reveal>
				</div>
			</AbsoluteFill>
		</Space>
	);
};
