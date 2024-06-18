import { initDB } from 'react-indexed-db-hook';
import { useUiContext } from './hooks';
import { dbConfig, pageNames } from './constants';
import { Notifications } from './common/components';
import { DottedBackground, Header, NavBar } from './components';
import { PredictImage, ShowHistory, ShowPrediction } from './pages';

initDB(dbConfig);

export const App = () => {
	const { currentPage } = useUiContext();

	return (
		<>
			<Header />

			<DottedBackground />

			{/* Content */}
			<main className='relative isolate pt-20 min-[385px]:pt-10 sm:pt-16 pb-4 mx-auto max-w-7xl px-5 lg:px-7'>
				<NavBar />

				{/* Pages */}
				{currentPage === pageNames.predictPage && <PredictImage />}
				{currentPage === pageNames.resultsPage && <ShowPrediction />}
				{currentPage === pageNames.historyPage && <ShowHistory />}
			</main>

			<Notifications />
		</>
	);
};
