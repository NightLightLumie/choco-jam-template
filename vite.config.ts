import { defineConfig } from 'vite';

import zip from 'vite-plugin-zip-pack';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import getGitVersion from './automation/git-version';
import neuBuild from './automation/neu-build';
import buildWinApp from './automation/win-bundle';
import buildMacApp from './automation/mac-bundle';
import buildLinuxApp from './automation/linux-bundle';
import buildCleanup from './automation/build-cleanup';

import { title, team, description, title_dashed } from './automation/constants';

export default () => {
	process.env.VITE_GAME_TITLE = title;
	process.env.VITE_GAME_TEAM = team;
	process.env.VITE_GAME_DESCRIPTION = description;

	return defineConfig({
		base: './',
		root: 'src',
		plugins: [
			tsconfigPaths(),
			getGitVersion(),
			checker({
				typescript: true,
			}),
			neuBuild(),
			buildWinApp(),
			buildMacApp(),
			buildLinuxApp(),
			zip({
				inDir: './dist/web',
				outDir: './dist',
				outFileName: `${title_dashed}-web.zip`,
			}),
			zip({
				inDir: `./dist/win`,
				outDir: './dist',
				outFileName: `${title_dashed}-win.zip`,
			}),
			zip({
				inDir: `./dist/linux`,
				outDir: './dist',
				outFileName: `${title_dashed}-linux.zip`,
			}),
			buildCleanup(),
		],
		build: {
			outDir: '../dist/web',
			chunkSizeWarningLimit: 4096,
			assetsInlineLimit: 0,
			target: 'ES2022',
			minify: 'terser',
			terserOptions: {
				format: {
					comments: false,
				},
			},
		},
		server: {
			host: '127.0.0.1',
		},
	});
};
