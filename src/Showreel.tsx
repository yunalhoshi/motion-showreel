import React from 'react';
import {AbsoluteFill, Audio, Series, getStaticFiles, interpolate, staticFile} from 'remotion';
import {Dot, Footage, Grain, Label, Reveal, Vignette} from './components';
import {Chapter, Word} from './kinetic';
import {AIReel, EventIndex, KillWall, ManifestoWall, TelegramPanel, VertCard} from './scenes';
import {EndCard, Grid3D, Item, Statement3D, Title3D, Triptych} from './space';
import {C, F} from './theme';

// Song: "SCREAM AND DANCE TEKK" ≈129.2 BPM, first beat at 0.441 s. Every cut lands on a beat.
const BEAT = (60 / 129.2) * 30; // frames per beat
const FIRST = Math.round(0.441 * 30);
const MUSIC = getStaticFiles().find((f) => f.name.startsWith('music/'));

const GG: Item[] = [
	['7523648308779158802', 507100], ['7520304644715744519', 485200], ['7570833721444551957', 386400],
	['7530695761563061512', 243700], ['7515125116850818322', 241200], ['7573796659650465045', 181700],
	['7613070562629389589', 146900], ['7522905851674365191', 103700], ['7576688580555263252', 100800],
	['7518077024833981704', 82700], ['7538841223826541842', 42000], ['7534035407881784594', 6806],
].map(([id, v]) => ({img: `thumbs/gg/${id}.jpg`, views: v as number}));

const OM: Item[] = [
	['C4Q18nBKEbI', 863], ['CzwcFwWq8TJ', 2823], ['Czlxzndq-9o', 1277], ['Czg9a8qKY4u', 1223], ['CzZBbU4q0oM', 1880],
	['CzVsGtKKDmP', 1817], ['CzPDFpYK1aw', 2990], ['CzJk36wqsSr', 3414], ['CzGkEd9K6bD', 1694],
].map(([id, v]) => ({img: `thumbs/om/${id}.jpg`, views: v as number}));

const BRAND_MIX: Item[] = [GG[0], OM[7], GG[1], OM[6], GG[2], OM[1], GG[3], OM[4], GG[5], OM[5], GG[4], OM[3]];
const ILAVE: Item[] = ['ilc6', 'ilc3', 'ilc2', 'ilc4', 'ilc1', 'ilc5'].map((n) => ({video: `clips/${n}.mp4`, loop: 58}));

const Clip: React.FC<{src: string; dur: number; volume?: number; children?: React.ReactNode}> = ({src, dur, volume = 0, children}) => (
	<AbsoluteFill>
		<Footage src={src} dur={dur} volume={volume} />
		<Vignette />
		{children}
	</AbsoluteFill>
);

const Super: React.FC<{label: string; line: string; delay?: number; sub?: string}> = ({label, line, delay = 6, sub}) => (
	<div style={{position: 'absolute', left: 80, bottom: 70, display: 'grid', gap: 10}}>
		<Reveal delay={delay}>
			<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
				<Dot size={12} />
				<Label color={C.pink} size={22}>
					{label}
				</Label>
			</div>
		</Reveal>
		<Reveal delay={delay + 4}>
			<div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1, color: C.paper, textShadow: '0 4px 30px rgba(0,0,0,.6)'}}>{line}</div>
		</Reveal>
		{sub && (
			<Reveal delay={delay + 8}>
				<Label size={22}>{sub}</Label>
			</Reveal>
		)}
	</div>
);

const Header: React.FC<{name: string; role: string; handle: string}> = ({name, role, handle}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: 26, flexWrap: 'wrap'}}>
		<span style={{fontFamily: F.ui, fontWeight: 800, fontSize: 66, letterSpacing: '-0.04em', color: C.paper}}>{name}</span>
		<span style={{fontFamily: F.ui, fontWeight: 500, fontSize: 34, letterSpacing: '-0.02em', color: C.pink}}>{role}</span>
		<span style={{fontFamily: F.ui, fontWeight: 400, fontSize: 26, color: C.mute}}>{handle}</span>
	</div>
);

type Seg = {beats: number; talk?: boolean; render: (frames: number) => React.ReactNode};

// AI section: clip lengths in beats, each clip talks for a moment before the next one
const AI_CLIPS: [string, number, string, boolean][] = [
	['clips/ai_meet.mp4', 5, 'AI avatar · HeyGen', true],
	['clips/ai_hush.mp4', 5, 'AI video · Hush', true],
	['clips/ai_blast.mp4', 2, 'AI video · Hush', true],
	['clips/fc_ve.mp4', 5, 'Me · on camera', false],
	['clips/fc_es.mp4', 4, 'Me · on camera', false],
	['clips/fc_mv.mp4', 3, 'Me · on camera', false],
];

const SEGS: Seg[] = [
	// OPEN: İlave TV greeting first, then the three slam words with their proof shots
	{beats: 4, talk: true, render: (d) => <Clip src="clips/ilc6.mp4" dur={d} volume={1} />},
	{beats: 2, render: (d) => <Word text={'On\ncamera.'} dur={d} />},
	{beats: 2, render: (d) => <VertCard src="clips/k_v6a.mp4" dur={d} />},
	{beats: 2, render: (d) => <Word text={'In\ngame.'} dur={d} />},
	{beats: 2, render: (d) => <Grid3D dur={d} items={BRAND_MIX} cols={6} aspect={9 / 16} focus={2} showViews={false} />},
	{beats: 2, render: (d) => <Word text={'On\nbrand.'} dur={d} />},
	// TITLE
	{
		beats: 8,
		render: (d) => (
			<Title3D
				dur={d}
				cards={[
					{video: 'clips/ilc6.mp4', loop: 85}, {video: 'clips/g_range2.mp4', loop: 65}, {video: 'clips/ai_meet.mp4', loop: 80}, {video: 'clips/ev_trophy.mp4', loop: 30},
					{video: 'clips/k_v6a.mp4', loop: 55}, {img: 'thumbs/om/CzJk36wqsSr.jpg'}, {video: 'clips/g_won.mp4', loop: 34}, {img: 'thumbs/gg/7523648308779158802.jpg'},
				]}
			/>
		),
	},
	// ON CAMERA: cropped İlave TV greetings with my own camera clips in between
	{beats: 2, render: (d) => <Chapter text="On camera" label="İlave TV · Host" dur={d} />},
	{beats: 2, render: (d) => <Clip src="clips/ilc3.mp4" dur={d}><Super label="İlave TV" line="Street reporter" sub="Live on the street" delay={2} /></Clip>},
	{beats: 2, render: (d) => <Clip src="clips/g_face.mp4" dur={d} />},
	{beats: 2, render: (d) => <Clip src="clips/ilc2.mp4" dur={d} />},
	{beats: 2, render: (d) => <Clip src="clips/ilc4.mp4" dur={d} />},
	{beats: 2, render: (d) => <Clip src="clips/g_car.mp4" dur={d} />},
	{beats: 2, render: (d) => <Clip src="clips/ilc1.mp4" dur={d} />},
	{beats: 8, render: (d) => <Grid3D dur={d} items={ILAVE} cols={3} aspect={16 / 9} focus={0} showViews={false} glowAll kicker="İlave TV · 6 episodes" stat={{value: 237000, suffix: '+', label: 'Views across 6 episodes', delay: 10}} />},
	// LIVE EVENTS (lands on the drop)
	{beats: 2, render: (d) => <Chapter text="Live events" label="Staff · A to Z" dur={d} />},
	{
		beats: 16,
		render: (d) => (
			<EventIndex
				dur={d}
				rows={[
					{role: 'Stage', src: 'clips/ev_stage.mp4'},
					{role: 'Referees', src: 'clips/ev_award.mp4'},
					{role: 'Players', src: 'clips/ev_trophy.mp4'},
					{role: 'Network', src: 'clips/ev_net.mp4', len: 15},
					{role: 'OBS & broadcast', src: 'clips/ev_fire.mp4'},
					{role: 'Operations', src: 'clips/da_hall.mp4'},
					{role: 'Live audience', src: 'clips/ev_crowd.mp4'},
				]}
			/>
		),
	},
	// IN GAME: range first, then only kill shots
	{beats: 2, render: (d) => <Chapter text="In game" label="Valorant · YouTube · Twitch" dur={d} />},
	{beats: 4, render: (d) => <Clip src="clips/g_range2.mp4" dur={d}><Super label="Creator & editor" line="Gaming edits" sub="YouTube · Twitch" delay={3} /></Clip>},
	{beats: 6, render: (d) => <KillWall dur={d} srcs={['clips/k_v6a.mp4', 'clips/k_lojv.mp4', 'clips/k_raze.mp4']} label="Valorant · my clips" />},
	{beats: 2, render: (d) => <Clip src="clips/g_won.mp4" dur={d} />},
	{beats: 3, render: (d) => <Clip src="clips/g_play2.mp4" dur={d} />},
	{beats: 3, render: (d) => <VertCard src="clips/k_v6b.mp4" dur={d} tilt={8} />},
	// GG CLAN
	{beats: 2, render: (d) => <Chapter text="GG Clan" label="Global Partnership Manager & Coach" dur={d} />},
	{beats: 10, render: (d) => <Triptych dur={d} kicker="01 · Create" caption="Vertical content for GG Clan" items={[{video: 'clips/gg_a.mp4', label: 'Call of Duty', views: 507100}, {video: 'clips/gg_b.mp4', label: 'Warzone', views: 485200}, {video: 'clips/gg_c.mp4', label: 'Battlefield', views: 386400}]} />},
	{
		beats: 16,
		render: (d) => (
			<Grid3D dur={d} items={GG} cols={6} aspect={9 / 16} focus={0} kicker="02 · Promote   →   03 · Results" stat={{value: 1863600, label: 'Views · top 5 · paid TikTok distribution', delay: 30}}
				header={<Header name="GG Clan" role="Global Partnership Manager & Coach" handle="TikTok · @ggclanworld" />} />
		),
	},
	// AI VIDEO
	{beats: AI_CLIPS.reduce((a, c) => a + c[1], 0), talk: true, render: (d) => <AIReel dur={d} clips={AI_CLIPS.map(([src, b, tag, ai]) => ({src, frames: Math.round(b * BEAT), tag, ai}))} />},
	// OMCHAIN + TELEGRAM
	{beats: 2, render: (d) => <Chapter text="Omchain" label="Social Media Manager" dur={d} />},
	{
		beats: 14,
		render: (d) => (
			<Grid3D dur={d} items={OM} cols={3} aspect={9 / 16} focus={7} kicker="Instagram & Telegram · Nov 2023 – Mar 2024"
				header={<Header name="omchain" role="Social Media Manager" handle="Instagram · @omchainio" />}>
				<TelegramPanel delay={Math.round(d * 0.35)} />
			</Grid3D>
		),
	},
	// CLOSE
	{
		beats: 12,
		render: (d) => (
			<ManifestoWall
				dur={d}
				lines={['Gaming culture', 'Content creation', 'On-camera experience', 'Marketing strategy']}
				items={[
					{video: 'clips/ilc6.mp4'}, {video: 'clips/g_range2.mp4'}, {img: 'thumbs/gg/7523648308779158802.jpg'}, {video: 'clips/ev_stage.mp4'}, {img: 'thumbs/om/CzJk36wqsSr.jpg'}, {video: 'clips/g_won.mp4'},
					{img: 'thumbs/gg/7520304644715744519.jpg'}, {video: 'clips/ilc2.mp4'}, {video: 'clips/ev_trophy.mp4'}, {img: 'thumbs/om/CzPDFpYK1aw.jpg'}, {video: 'clips/g_face.mp4'}, {img: 'thumbs/gg/7570833721444551957.jpg'},
					{video: 'clips/ilc4.mp4'}, {img: 'thumbs/gg/7530695761563061512.jpg'}, {video: 'clips/da_hall.mp4'}, {img: 'thumbs/om/CzwcFwWq8TJ.jpg'}, {video: 'clips/g_play2.mp4'}, {video: 'clips/ilc1.mp4'},
				]}
			/>
		),
	},
	{beats: 9, render: (d) => <Statement3D dur={d} lines={["Let's build something", 'people want to watch,', 'share, and be part of.']} accent="people want to watch," />},
	{beats: 9, render: (d) => <EndCard dur={d} />},
];

// Beat-locked frame boundaries (no drift: each boundary is rounded from the running beat count)
const bounds: number[] = [0];
{
	let beats = 0;
	SEGS.forEach((s, i) => {
		beats += s.beats;
		bounds.push(FIRST + Math.round(beats * BEAT) - (i === SEGS.length - 1 ? 0 : 0));
	});
}
export const TOTAL = bounds[bounds.length - 1] + 20;
const TALK = SEGS.map((s, i) => (s.talk ? [bounds[i], bounds[i + 1]] : null)).filter(Boolean) as [number, number][];

const musicVolume = (f: number) => {
	const talking = TALK.some(([a, b]) => f >= a - 4 && f < b + 4);
	const fadeIn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
	const fadeOut = interpolate(f, [TOTAL - 45, TOTAL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (talking ? 0.22 : 0.9) * fadeIn * fadeOut;
};

export const Showreel: React.FC = () => (
	<AbsoluteFill style={{background: C.ink}}>
		<Series>
			{SEGS.map((s, i) => {
				const d = bounds[i + 1] - bounds[i] + (i === SEGS.length - 1 ? 20 : 0);
				return (
					<Series.Sequence key={i} durationInFrames={d}>
						{s.render(d)}
					</Series.Sequence>
				);
			})}
		</Series>
		<Grain opacity={0.07} />
		{MUSIC && <Audio src={staticFile(MUSIC.name)} volume={musicVolume} />}
	</AbsoluteFill>
);
