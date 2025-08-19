import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	server: {
		open: '/pages/index.html'
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				home: resolve(__dirname, 'pages/index.html'),
				account: resolve(__dirname, 'pages/account.html'),
				discover: resolve(__dirname, 'pages/discover.html'),
				notfound: resolve(__dirname, 'pages/notfound.html'),
			},
		},
	}
})


