import { defineConfig } from 'vite'
import { resolve } from 'path'

// Use GitHub Pages subpath when building in Actions; otherwise use root
const basePath = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : '/'

export default defineConfig({
    base: basePath,
	server: {
		open: '/pages/index.html'
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				home: resolve(__dirname, 'pages/index.html'),
				account: resolve(__dirname, 'pages/account.html'),
				programs: resolve(__dirname, 'pages/programs.html'),
				nutrition: resolve(__dirname, 'pages/nutrition.html'),
				live: resolve(__dirname, 'pages/live.html'),
				progress: resolve(__dirname, 'pages/progress.html'),
			},
		},
	}
})


