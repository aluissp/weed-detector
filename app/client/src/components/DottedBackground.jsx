export const DottedBackground = () => {
	return (
		<>
			<div className='fixed dotted-background h-full top-0 left-0 right-0 z-0'></div>
			<div
				className='absolute right-[100px] z-10 h-[150px] w-[400px] rotate-[0deg] transform rounded-full bg-gradient-to-tl from-slate-800 via-teal-500 to-zinc-400 blur-[150px]'
				style={{ width: '600px', top: '-180px' }}
			></div>
		</>
	);
};
