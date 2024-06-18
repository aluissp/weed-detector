import JSZip from 'jszip';
import { modelClassNames } from '../constants';

export const unzipImageResponse = async file => {
	const zip = await JSZip.loadAsync(file);
	let jsonData = await zip.file('inference_results.json').async('string');

	jsonData = JSON.parse(jsonData);

	const fileName = Object.keys(jsonData)[0];

	let image = await zip.file(`predict/${fileName}`).async('blob');

	image = await readImage(image);

	const tableData = getTableSummary(Object.values(jsonData)[0]?.summary);

	jsonData = { fileName, tableData, ...Object.values(jsonData)[0] };

	return { file, image, jsonData };
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

const getTableSummary = summary => {
	const tableData = summary.reduce((acc, { class: classId, confidence }) => {
		const className = modelClassNames[classId];

		if (!acc[classId]) {
			acc[classId] = { className, avgConfidence: confidence, count: 1 };
			return acc;
		}

		acc[classId].count += 1;

		const prevConfidence = acc[classId].avgConfidence;

		acc[classId].avgConfidence = prevConfidence + confidence;

		return acc;
	}, {});

	Object.entries(tableData).forEach(([key, value]) => {
		tableData[key].avgConfidence = value.avgConfidence / tableData[key].count;
		tableData[key].avgConfidence = +tableData[key].avgConfidence.toFixed(4);
	});

	return tableData;
};
