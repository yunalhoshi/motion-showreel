import React from 'react';
import {AbsoluteFill, Easing, Img, Loop, OffthreadVideo, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Dot, Label, Reveal} from './components';
import {C, F} from './theme';

const ease = Easing.bezier(0.5, 0, 0.2, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Vid: React.FC<{src: string; volume?: number; loop?: number; style?: React.CSSProperties}> = ({src, volume = 0, loop, style}) => {
	const v = <OffthreadVideo src={staticFile(src)} volume={volume} muted={volume === 0} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />;
	return loop ? <Loop durationInFrames={loop}>{v}</Loop> : v;
};

/** A vertical clip as a lit card over a blurred copy of itself (no heavy zoom on 9:16 footage). */
export const VertCard: React.FC<{src: string; dur: number; label?: string; volume?: number; tilt?: number}> = ({src, dur, label, volume = 0, tilt = -8}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [0, 6], [1.08, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const ry = interpolate(f, [0, dur], [tilt, tilt * -0.4]);
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<AbsoluteFill style={{filter: 'blur(36px) brightness(.4) saturate(1.3)', transform: 'scale(1.3)'}}>
				<Vid src={src} />
			</AbsoluteFill>
			<AbsoluteFill style={{perspective: 2000, justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 540, height: 960, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${C.pink}`, boxShadow: '0 0 80px rgba(255,45,135,.45)', transform: `rotateY(${ry}deg) scale(${sc})`}}>
					<Vid src={src} volume={volume} />
				</div>
			</AbsoluteFill>
			{label && (
				<div style={{position: 'absolute', left: 90, bottom: 80}}>
					<Label size={22}>{label}</Label>
				</div>
			)}
		</AbsoluteFill>
	);
};

/** Three vertical kill clips side by side, playing together. */
export const KillWall: React.FC<{dur: number; srcs: string[]; label: string}> = ({dur, srcs, label}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 60%, #1c0a14, ${C.ink} 72%)`, perspective: 2000}}>
			<AbsoluteFill style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 34, transform: `rotateY(${interpolate(f, [0, dur], [6, -6])}deg)`}}>
				{srcs.map((s, i) => {
					const p = spring({frame: f - i * 3, fps, config: {damping: 200}});
					return (
						<div key={s} style={{width: 470, height: 836, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(244,240,242,.2)', opacity: p, transform: `translateY(${(1 - p) * 90}px)`, boxShadow: '0 40px 90px rgba(0,0,0,.6)'}}>
							<Vid src={s} loop={55} />
						</div>
					);
				})}
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 90, bottom: 60}}>
				<Label size={22} color={C.paper}>
					{label}
				</Label>
			</div>
		</AbsoluteFill>
	);
};

/** Events: the "Index" list (pink dot moves row to row) beside a 3D card that swaps footage per role. */
export const EventIndex: React.FC<{dur: number; rows: {role: string; src: string; len?: number}[]}> = ({dur, rows}) => {
	const f = useCurrentFrame();
	const per = dur / rows.length;
	const active = Math.min(rows.length - 1, Math.floor(f / per));
	const local = f - active * per;
	const ry = interpolate(f, [0, dur], [-20, -10]);
	const cardIn = interpolate(local, [0, 5], [1.06, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{background: `radial-gradient(60% 70% at 70% 55%, #1c0a14, ${C.ink} 72%)`}}>
			<AbsoluteFill style={{perspective: 2200}}>
				<div style={{position: 'absolute', right: 90, top: 190, width: 1040, height: 585, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${C.pink}`, boxShadow: '0 0 90px rgba(255,45,135,.35), 0 40px 100px rgba(0,0,0,.7)', transform: `rotateY(${ry}deg) scale(${cardIn})`}}>
					<Vid key={active} src={rows[active].src} loop={Math.min(Math.round(per), rows[active].len ?? 32)} />
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 100, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4}}>
				<div style={{marginBottom: 26, display: 'grid', gap: 8}}>
					<Label color={C.pink} size={22}>
						Event &amp; broadcast operations
					</Label>
					<Label size={20} color={C.mute}>
						Gençlik Kupası · GSB × TESFED / DigiAge
					</Label>
				</div>
				{rows.map((r, i) => {
					const on = i === active;
					const lift = on ? interpolate(local, [0, 8], [0, 1], clamp) : 0;
					return (
						<div key={r.role} style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: F.ui, fontWeight: 200, fontSize: 60, letterSpacing: '-0.025em', lineHeight: 1.08, color: on ? C.paper : 'rgba(244,240,242,.24)', transform: `translateX(${lift * 18}px)`}}>
							<span style={{width: 14, display: 'inline-flex', transform: `scale(${lift})`}}>
								<Dot size={14} />
							</span>
							{r.role}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** AI video section: one card whose clip changes every few seconds, with a short note about AI production. */
export const AIReel: React.FC<{dur: number; clips: {src: string; frames: number; tag: string; ai: boolean}[]}> = ({dur, clips}) => {
	const f = useCurrentFrame();
	let acc = 0;
	let cur = clips[0];
	for (const c of clips) {
		if (f >= acc) cur = c;
		acc += c.frames;
	}
	const ry = interpolate(f, [0, dur], [-12, -4]);
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<AbsoluteFill style={{filter: 'blur(44px) brightness(.4) saturate(1.3)', transform: 'scale(1.3)'}}>
				<Series>
					{clips.map((c) => (
						<Series.Sequence key={c.src} durationInFrames={c.frames}>
							<Vid src={c.src} />
						</Series.Sequence>
					))}
				</Series>
			</AbsoluteFill>
			<AbsoluteFill style={{perspective: 2000}}>
				<div style={{position: 'absolute', right: 230, top: 60, width: 540, height: 960, borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${C.pink}`, boxShadow: '0 0 90px rgba(255,45,135,.5), 0 40px 100px rgba(0,0,0,.7)', transform: `rotateY(${ry}deg)`}}>
					<Series>
						{clips.map((c) => (
							<Series.Sequence key={c.src} durationInFrames={c.frames}>
								<Vid src={c.src} volume={1} />
							</Series.Sequence>
						))}
					</Series>
					<div style={{position: 'absolute', left: 18, top: 18, padding: '8px 14px', borderRadius: 999, background: cur.ai ? C.pink : 'rgba(5,4,5,.75)', border: cur.ai ? 'none' : '1px solid rgba(244,240,242,.3)'}}>
						<Label size={16} color={cur.ai ? C.ink : C.paper}>
							{cur.tag}
						</Label>
					</div>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 820, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
				<Reveal delay={4}>
					<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
						<Dot size={14} />
						<Label color={C.pink} size={24}>
							AI video production
						</Label>
					</div>
				</Reveal>
				<Reveal delay={8}>
					<div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 140, letterSpacing: '-0.05em', lineHeight: 0.86, textTransform: 'uppercase', color: C.paper}}>
						GG Clan
						<br />× Hush
					</div>
				</Reveal>
				<Reveal delay={14}>
					<div style={{fontFamily: F.ui, fontWeight: 400, fontSize: 36, lineHeight: 1.3, letterSpacing: '-0.01em', color: C.paper, maxWidth: 760}}>
						I produce launch content with AI avatars and AI voice, then script and edit it for TikTok and Reels.
					</div>
				</Reveal>
				<Reveal delay={20}>
					<Label size={20} color={C.mute}>
						Script · AI avatar · Voice · Edit
					</Label>
				</Reveal>
			</div>
		</AbsoluteFill>
	);
};

const PLANE = (
	<svg viewBox="0 0 24 24" width="46" height="46">
		<path fill="#fff" d="M21.5 3.6 2.9 10.8c-1.1.4-1.1 1.3-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5ZM8.4 13.6l9.7-6.1c.5-.3.9-.1.5.2l-8 7.3-.3 3.4-1.9-4.8Z" />
	</svg>
);

/** Telegram community panel: the channel header and message bubbles slide in (no invented text or numbers). */
export const TelegramPanel: React.FC<{delay?: number}> = ({delay = 0}) => {
	const f = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();
	const p = spring({frame: f, fps, config: {damping: 200}});
	const bubbles = [0.78, 0.55, 0.9, 0.62];
	return (
		<div style={{position: 'absolute', right: 80, top: 150, width: 460, opacity: p, transform: `translateX(${(1 - p) * 120}px) perspective(1600px) rotateY(-14deg)`}}>
			<div style={{borderRadius: 26, overflow: 'hidden', background: 'rgba(14,12,16,.92)', border: '1px solid rgba(244,240,242,.14)', boxShadow: '0 40px 100px rgba(0,0,0,.6)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', borderBottom: '1px solid rgba(244,240,242,.1)'}}>
					<div style={{width: 72, height: 72, borderRadius: '50%', background: '#2AABEE', display: 'grid', placeItems: 'center'}}>{PLANE}</div>
					<div style={{display: 'grid', gap: 6}}>
						<div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.paper}}>Telegram</div>
						<Label size={16} color={C.mute}>
							Community management
						</Label>
					</div>
				</div>
				<div style={{padding: 24, display: 'grid', gap: 14}}>
					{bubbles.map((w, i) => {
						const b = spring({frame: f - 10 - i * 8, fps, config: {damping: 14, mass: 0.6}});
						const mine = i % 2 === 1;
						return (
							<div key={i} style={{justifySelf: mine ? 'end' : 'start', width: `${w * 100}%`, height: 54, borderRadius: 18, background: mine ? '#2AABEE' : 'rgba(244,240,242,.1)', transform: `scale(${b})`, transformOrigin: mine ? 'right center' : 'left center', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10}}>
								<div style={{height: 10, borderRadius: 5, background: mine ? 'rgba(255,255,255,.6)' : 'rgba(244,240,242,.35)', width: '70%'}} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

/** Closing: a slow 3D wall of the work, with the four strengths lighting up one by one (Index style). */
export const ManifestoWall: React.FC<{dur: number; items: {video?: string; img?: string}[]; lines: string[]}> = ({dur, items, lines}) => {
	const f = useCurrentFrame();
	const per = (dur - 20) / lines.length;
	const active = Math.min(lines.length - 1, Math.max(0, Math.floor((f - 10) / per)));
	const drift = interpolate(f, [0, dur], [0, -260]);
	const op = interpolate(f, [0, 10, dur - 8, dur], [0, 1, 1, 0], clamp);
	return (
		<AbsoluteFill style={{background: C.ink, opacity: op}}>
			<AbsoluteFill style={{perspective: 1800}}>
				<div style={{position: 'absolute', left: 420, top: 120, width: 2100, display: 'grid', gridTemplateColumns: 'repeat(6, 330px)', gridAutoRows: '206px', gap: 22, transform: `rotateY(-24deg) rotateX(10deg) translateX(${drift}px)`, transformOrigin: 'left center', opacity: 0.75}}>
					{items.map((it, i) => (
						<div key={i} style={{position: 'relative', width: 330, height: 206, borderRadius: 14, overflow: 'hidden', background: '#111'}}>
							{it.video ? <Vid src={it.video} loop={30} /> : <Img src={staticFile(it.img!)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
						</div>
					))}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,4,5,.96) 0%, rgba(5,4,5,.82) 38%, rgba(5,4,5,.25) 70%, rgba(5,4,5,.1) 100%)'}} />
			<div style={{position: 'absolute', left: 140, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6}}>
				<Reveal delay={2}>
					<Label color={C.pink} size={24} style={{marginBottom: 24}}>
						I bring together
					</Label>
				</Reveal>
				{lines.map((l, i) => {
					const on = i === active;
					const seen = i <= active;
					const lift = on ? interpolate(f - 10 - i * per, [0, 10], [0, 1], clamp) : 0;
					return (
						<div key={l} style={{display: 'flex', alignItems: 'center', gap: 26, fontFamily: F.ui, fontWeight: on ? 500 : 200, fontSize: 104, letterSpacing: '-0.045em', lineHeight: 1.04, color: on ? C.paper : seen ? 'rgba(244,240,242,.42)' : 'rgba(244,240,242,.16)', transform: `translateX(${lift * 24}px)`}}>
							<span style={{width: 18, display: 'inline-flex', transform: `scale(${on ? lift : 0})`}}>
								<Dot size={18} />
							</span>
							{l}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
