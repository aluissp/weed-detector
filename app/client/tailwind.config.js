/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			mono: ['"DM Sans"', 'Inter', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
		},
		extend: {
			colors: { danger: '#fd517d', dark: '#2c323f' },
			animation: { fade: 'fadeIn .3s ease-in-out' },
			keyframes: {
				fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
			},
		},
	},
	plugins: [],
};
