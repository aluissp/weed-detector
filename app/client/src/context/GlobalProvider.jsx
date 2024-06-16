/* eslint-disable react/prop-types */
import { UiProvider } from './ui';
import { ImagesProvider } from './images';

export const GlobalProvider = ({ children }) => {
	return (
		<UiProvider>
			<ImagesProvider>{children}</ImagesProvider>
		</UiProvider>
	);
};
