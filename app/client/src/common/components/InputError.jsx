import PropTypes from 'prop-types';
import { RiErrorWarningLine } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

const defaultStyles = 'text-danger text-sm min-h-5 pt-1 flex gap-1';

export const InputError = ({ error, className = '' }) => {
	return (
		<p className={twMerge(defaultStyles, className)}>
			{error && <RiErrorWarningLine className='mt-[2px] min-w-fit' />}
			{error}
		</p>
	);
};

InputError.propTypes = {
	error: PropTypes.string,
	className: PropTypes.string,
};
