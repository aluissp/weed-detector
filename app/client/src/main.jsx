import React from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { App } from './App';
import './index.css';
import { GlobalProvider } from './context/GlobalProvider';
import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';

i18next.init({
	lng: localStorage.getItem('lang') || 'es',
	resources: {
		en: { global: global_en },
		es: { global: global_es },
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<GlobalProvider>
			<I18nextProvider i18n={i18next}>
				<App />
			</I18nextProvider>
		</GlobalProvider>
	</React.StrictMode>
);
