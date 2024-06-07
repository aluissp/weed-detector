import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

function App() {
	const [count, setCount] = useState(0);
	const [data, setData] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await axios.get('api');
			setData(data);
		};

		fetchData();
	}, []);

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => setCount(count => count + 1)}>El contador es {count}</button>
			</div>

			<div>
				<h1>API</h1>
				{data ? (
					<>
						<p>{data}</p>
					</>
				) : (
					<p>Cargando...</p>
				)}
			</div>
		</>
	);
}

export default App;
