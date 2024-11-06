import JSZip from 'jszip';
import { modelClassKeys } from '../constants'


export const unzipImageResponse = async file => {
	// Unzip file
	const zip = await JSZip.loadAsync(file);
	let jsonData = await zip.file('inference_results.json').async('string');

	jsonData = JSON.parse(jsonData);

	// Get image and file name
	const [fileName] = Object.keys(jsonData);
	let image = await zip.file(`predict/${fileName}`).async('blob');
	image = await readImage(image);

	// Get predictions
	const predictions = Object.values(jsonData)[0]?.summary || [];

	// Get table summary
	const summary = getTableSummary(predictions);

	// Get clean name
	const name = fileName.replace('.jpeg', '').replace('.jpg', '').replace('.png', '');

	// Get total infestation rate
	const totalInfestationRate = computeTotalInfestationRate(summary);

	// Update json data
	jsonData = { ...Object.values(jsonData)[0], name, fileName, summary, predictions, totalInfestationRate };

	// Remove old file and add new JSON file
	zip.remove('inference_results.json');
	zip.file('inference_results.json', JSON.stringify(jsonData));
	file = await zip.generateAsync({ type: 'blob' });

	return { ...jsonData, file, image };
};

const readImage = image => {
	const reader = new FileReader();

	reader.readAsDataURL(image);

	return new Promise((resolve, reject) => {
		reader.onload = ({ target }) => {
			resolve(target?.result);
		};

		reader.onerror = error => {
			reject(error);
		};
	});
};

const getTableSummary = predictions => {
	// Group by class to calculate avg confidence
	const tableSummary = predictions.reduce((acc, { class: classId, confidence }) => {

		if (!acc[classId]) {
			acc[classId] = { avgConfidence: confidence, count: 1 };
			return acc;
		}

		acc[classId].count += 1;

		const prevConfidence = acc[classId].avgConfidence;

		acc[classId].avgConfidence = prevConfidence + confidence;

		return acc;
	}, {});


	const total = predictions.length;
	Object.entries(tableSummary).forEach(([key, value]) => {
		// Calculate avg confidence
		tableSummary[key].avgConfidence = value.avgConfidence / tableSummary[key].count;
		tableSummary[key].avgConfidence = +tableSummary[key].avgConfidence.toFixed(4);

		// Calculate coverage (%)
		tableSummary[key].coverage = (tableSummary[key].count / total) * 100;
		tableSummary[key].coverage = +tableSummary[key].coverage.toFixed(4);
	});

	return tableSummary;
};


const computeTotalInfestationRate = tableSummary => {
	let totalInfestationRate = Object.values(tableSummary).reduce((acc, { coverage }) => acc + coverage, 0);

	totalInfestationRate -= tableSummary[modelClassKeys.papa]?.coverage || 0;

	totalInfestationRate = +totalInfestationRate.toFixed(4);

	return totalInfestationRate;
}
