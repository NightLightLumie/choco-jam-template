import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('backgrounds/bkgbuild', 'bkgbuild'),
	image('backgrounds/blank_bkg', 'blank_bkg'),

	// Characters
	image('characters/player', 'player'),

	image('characters/rhead', 'rhead'),
	image('characters/rbody', 'rbody'),
	image('characters/rarm', 'rarm'),
	image('characters/rleg', 'rleg'),

	// Items
	image('items/coin', 'coin'),
	image('items/next_scene_button', 'next_scene_button'),
	image('items/rip', 'rip'),
	image('items/sbullet', 'sbullet'),
	image('items/bee', 'bee'),

	// UI
	image('ui/hud', 'hud'),

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("effects/flash", "flash", 128, 128),
	spritesheet("effects/hit_spark", "hit_spark", 128, 128),
	spritesheet("effects/meme_explosion", "meme_explosion", 200, 282),
	spritesheet("effects/explosion_orange", "explosion_orange", 256, 256),
	spritesheet("effects/explosion_tiny", "explosion_tiny", 512, 512),
	spritesheet("effects/bad_fire", "bad_fire", 512, 512),
	spritesheet("effects/blue_sparkle", "blue_sparkle", 256, 256),
	spritesheet("effects/gray_magic", "gray_magic", 128, 128),
	spritesheet("effects/red_magic", "red_magic", 128, 128),
	spritesheet("effects/blue_magic", "blue_magic", 128, 128),
	spritesheet("effects/gold_magic", "gold_magic", 128, 128),
	spritesheet("effects/rainbow_magic", "rainbow_magic", 128, 128),
	spritesheet("effects/booster", "booster", 80, 80),
	spritesheet("effects/laser_eye", "laser_eye", 64, 64),
	spritesheet("effects/explosion_red", "explosion_red", 256, 256),
	spritesheet("effects/laser", "laser", 240, 80),
	spritesheet("effects/lasersmall", "lasersmall", 30, 80),
	spritesheet("effects/fireball", "fireball", 256, 128),
	spritesheet("effects/flare", "flare", 256, 256),
	spritesheet("effects/saw", "saw", 256, 256),
	spritesheet("effects/door", "door", 256, 256),
	spritesheet("effects/katana", "katana", 256, 128),
	spritesheet("effects/sqbutton", "sqbutton", 256, 184),
	spritesheet("effects/tbase", "tbase", 256, 256),
	spritesheet("effects/tgun", "tgun", 256, 256),
	spritesheet("effects/pan", "pan", 450, 450),
	spritesheet("effects/beelaser", "beelaser", 960, 300),
];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
	sound('pan', 'pan', 0.5),
	sound('laserboom', 'laserboom', 0.5),
	sound('burstlaser', 'burstlaser', 0.5),
	sound('takeoff', 'takeoff', 0.5),
	sound('sonar', 'sonar', 0.5),
	sound('punch', 'punch', 0.5),
	sound('bigfire', 'bigfire', 0.5),
	sound('fireblast', 'fireblast', 0.5),
	sound('saw', 'saw', 0.5),
	sound('katana', 'katana', 0.5),
	sound('scroll', 'scroll', 0.5),
	sound('place', 'place', 0.5),
	sound('gun', 'gun', 0.5),
	sound('hit', 'hit', 0.5),
	sound('panthrow', 'panthrow', 0.5),
	sound('crit', 'crit', 0.5),
	sound('bees', 'bees', 0.5),
	sound('door', 'door', 0.5),
	sound('bonk', 'bonk', 0.5),
	sound('turret', 'turret', 0.5),
];

/* Fonts */
await loadFont('Sketch', 'Game Font');

export {
	images,
	spritesheets,
	audios
};