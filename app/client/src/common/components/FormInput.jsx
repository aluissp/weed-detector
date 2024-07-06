/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { InputError } from './InputError';

const defaultStyles =
	'bg-white w-full rounded-lg p-[6px] outline-none placeholder:text-dark text-sm text-dark';

export const FormInput = forwardRef(function FormInput(props, ref) {
	const { id, labelText, labelIsRequiredTick, error, className, ...inputProps } = props;

	return (
		<div className={className}>
			<label htmlFor={id} className='block text-sm font-medium'>
				{labelText} {labelIsRequiredTick && <span className='text-red-500'>*</span>}
			</label>
			<div className='relative'>
				<input id={id} ref={ref} className={defaultStyles} {...inputProps} />
			</div>
			<InputError error={error} />
		</div>
	);
});
