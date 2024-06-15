import { DottedBackground, Header, NavBar } from './components';
import { PredictImage } from './pages/PredictImage';

export const App = () => {
	return (
		<>
			{/* Header */}
			<Header />

			{/* Background */}
			<DottedBackground />

			{/* Content */}
			<main className='relative isolate pt-20 min-[385px]:pt-10 sm:pt-16 pb-4 mx-auto max-w-7xl px-5 lg:px-7'>
				{/* Navbar */}
				<NavBar />

				{/* Pages */}
				<PredictImage />
			</main>
		</>
	);
};
