/* eslint-disable react/prop-types */
import { twMerge } from 'tailwind-merge';

const defaultButtonStyle =
	'rounded-xl px-2 sm:px-4 h-[35px] inline-flex items-center justify-center bg-zinc-800 hover:bg-teal-700 transition-colors outline-none gap-2';
const disabledStyles = 'disabled:bg-zinc-800 disabled:text-gray-200 flex-wrap cursor-progress';

export const FormButton = ({ onClick, className, children, focus, disabled, ...props }) => {
	return (
		<button
			className={twMerge(
				defaultButtonStyle,
				className,
				disabled && disabledStyles,
				focus && 'bg-teal-700'
			)}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};
