/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const defaultStyles =
	"relative h-6 w-11 after:h-5 after:w-5 peer-checked:after:translate-x-5 rounded-full border border-slate-300 bg-slate-100 after:absolute after:bottom-0 after:left-[0.0625rem] after:top-0 after:my-auto after:rounded-full after:bg-slate-700 after:transition-all after:content-[''] peer-checked:bg-teal-700 peer-checked:after:bg-slate-100 peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-slate-800 peer-focus:peer-checked:outline-teal-700 peer-active:outline-offset-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:after:bg-slate-300 dark:peer-checked:bg-teal-600 dark:peer-checked:after:bg-slate-100 dark:peer-focus:outline-slate-300 dark:peer-focus:peer-checked:outline-teal-600";

export const ToggleInput = forwardRef(function ToggleInput(props, ref) {
	const { id, className = '', labelText, ...inputProps } = props;

	return (
		<label
			htmlFor={id}
			className={twMerge('inline-flex cursor-pointer justify-between gap-1', className)}
		>
			<input
				id={id}
				ref={ref}
				type='checkbox'
				className='peer sr-only'
				role='switch'
				{...inputProps}
			/>
			<span className='trancking-wide text-sm font-medium text-slate-700 peer-checked:text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white dark:peer-checked:text-teal-400'>
				{labelText}
			</span>
			<div className={defaultStyles} aria-hidden='true' />
		</label>
	);
});
