export const downloadFile = async (fileBlob, fileName = '', extension = 'zip') => {
	const href = URL.createObjectURL(fileBlob);

	const anchorElement = document.createElement('a');
	anchorElement.href = href;
	anchorElement.download = fileName + '.' + extension;

	document.body.appendChild(anchorElement);
	anchorElement.click();

	document.body.removeChild(anchorElement);
	window.URL.revokeObjectURL(href);
};
