import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd());
	const apiPrefix = env?.VITE_USER_NODE_ENV === 'development' ? '/api' : '/';

	return {
		plugins: [react()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		server: {
			proxy: {
				[apiPrefix]: {
					target: env.VITE_API_URL,
					rewrite: path => path.replace(/^\/api/, ''),
				},
			},
			// watch: { usePolling: true }, // For WSL2 in Windows
		},
	};
});
