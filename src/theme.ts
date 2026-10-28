import {loadFont as loadGeist} from '@remotion/google-fonts/Geist';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import {loadFont as loadBodoni} from '@remotion/google-fonts/BodoniModa';

const geist = loadGeist('normal', {weights: ['200', '300', '500', '600', '800', '900'], subsets: ['latin', 'latin-ext']});
const mono = loadMono('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']});
const bodoni = loadBodoni('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']});

export const F = {
	ui: geist.fontFamily,
	mono: mono.fontFamily,
	serif: bodoni.fontFamily,
};

export const C = {
	ink: '#050405',
	paper: '#f4f0f2',
	mute: '#8a8187',
	dim: 'rgba(244,240,242,0.28)',
	pink: '#ff2d87',
};

export const FPS = 30;
