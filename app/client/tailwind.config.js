/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: { dark: { 100: '#181823', 200: '#1F1D2B' } },
			animation: { fade: 'fadeIn .3s ease-in-out' },
			keyframes: {
				fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
			},
		},
	},
	plugins: [],
};
