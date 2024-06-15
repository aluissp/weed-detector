/* eslint-disable react/prop-types */
import { UiProvider } from './ui';

export const GlobalProvider = ({ children }) => {
	return <UiProvider>{children}</UiProvider>;
};
