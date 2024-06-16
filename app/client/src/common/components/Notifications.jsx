import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useImagesContext } from '@/hooks';

export const Notifications = () => {
	const { errorMessage, message } = useImagesContext();

	useEffect(() => {
		if (message) toast.success(message);
		if (errorMessage) toast.error(errorMessage);
	}, [message, errorMessage]);

	return <Toaster richColors position='bottom-center' />;
};
