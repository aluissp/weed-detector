import { TbPhotoSearch } from 'react-icons/tb';
import { FormButton } from '../common/components';
import { LiaListSolid } from 'react-icons/lia';
import { RiHistoryFill } from 'react-icons/ri';
import { useUiContext } from '../hooks';
import { pageNames } from '../constants';

export const NavBar = () => {
	const { currentPage, handleSetCurrentPage } = useUiContext();
	return (
		<nav className='text-white text-xs sm:text-sm bg-transparent border-t border-b border-zinc-800 my-6'>
			<div className='py-4 mx-auto flex items-center justify-between gap-2'>
				<div className='flex gap-2 justify-start'>
					<FormButton
						focus={currentPage === pageNames.predictPage}
						onClick={() => handleSetCurrentPage({ pageName: pageNames.predictPage })}
					>
						<TbPhotoSearch className='text-xl' />
						Analizar imagen
					</FormButton>
					<FormButton
						focus={currentPage === pageNames.resultsPage}
						onClick={() => handleSetCurrentPage({ pageName: pageNames.resultsPage })}
					>
						<LiaListSolid className='text-xl' />
						Resultados
					</FormButton>
				</div>
				<FormButton
					onClick={() => handleSetCurrentPage({ pageName: pageNames.historyPage })}
					className='hover:bg-zinc-700 '
				>
					<RiHistoryFill className='text-xl' />
					Historial
				</FormButton>
			</div>
		</nav>
	);
};
