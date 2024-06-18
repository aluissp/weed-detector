export const dbConfig = Object.freeze({
	name: 'PredictionsHistoryDB',
	version: 1,
	objectStoresMeta: [
		{
			store: 'predictionFiles',
			storeConfig: { keyPath: 'id', autoIncrement: true },
			storeSchema: [
				{ name: 'name', keypath: 'name', options: { unique: false } },
				{ name: 'file', keypath: 'file', options: { unique: false } },
				{ name: 'date', keypath: 'date', options: { unique: false } },
			],
		},
	],
});