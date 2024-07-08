/* eslint-disable react/prop-types */
import { twMerge } from 'tailwind-merge';
import { useController } from 'react-hook-form';

const defaultStyles =
	'z-10 mb-1 mt-2 h-2 w-full appearance-none bg-slate-100 focus:outline-teal-700 dark:bg-slate-800 dark:focus:outline-teal-600 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-teal-700 active:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:dark:bg-teal-600 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:dark:bg-teal-600 [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full';

export const RangeInput = ({
	id,
	labelText,
	className,
	step,
	min,
	max,
	thickNumber = 9,
	...props
}) => {
	const {
		field: { onChange, value },
	} = useController(props);

	return (
		<div className={twMerge('my-1', className)}>
			<label htmlFor={id} className='block text-sm font-medium'>{`${labelText}: ${value}`}</label>

			<input
				id={id}
				type='range'
				step={step}
				min={min}
				max={max}
				value={value}
				className={defaultStyles}
				onChange={({ target }) => onChange(target?.value)}
			/>

			<div className='flex items-center justify-between px-2 text-center text-slate-700 dark:text-slate-300'>
				<span
					className='w-0 -translate-x-1 text-xs even:hidden md:even:inline-block'
					aria-hidden='true'
				>
					{min}
				</span>

				{Array.from({ length: thickNumber }).map((_, index) => (
					<span
						key={index}
						className='text-[6px] font-bold opacity-50 even:hidden md:even:inline-block'
						aria-hidden='true'
					>
						|
					</span>
				))}

				<span
					className='w-0 -translate-x-2 text-xs even:hidden md:even:inline-block'
					aria-hidden='true'
				>
					{max}
				</span>
			</div>
		</div>
	);
};
