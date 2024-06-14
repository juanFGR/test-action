import type { APIRequestContext } from '@playwright/test';
import { promises as fs } from 'fs';

const models = ['page'];

export interface UrlPair {
	id: string;
    oldUrl: string;
    newUrl: string;
}



export async function getUrlsFromJson(filePath: string): Promise<UrlPair[]> {
    // Read the JSON file
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Parse the JSON content
    const jsonContent = JSON.parse(fileContent);
    
    // Assuming the JSON structure is:
    // { "owner": "someOwner", "branch": "someBranch", "urls": ["url1", "url2", ...] }
    const urlPairs: UrlPair[] = jsonContent.urls.map((urlObj: { id: string; old: string; new: string }) => ({
		id: urlObj.id,
        oldUrl: urlObj.old,
        newUrl: urlObj.new
    }));
    
    return urlPairs;
}


/**
 * Call a Builder content API to get all the URLs for all the models
 * @param request
 * @returns
 */
export async function getPageUrls(request: APIRequestContext): Promise<string[]> {
	const urls = [];
	for (const model of models) {
		const modelUrls = await getModelPageUrls(model, request);
		 //if (model === 'page') {
		 	//const pages = modelUrls.filter((url) => url.includes('/percy-test/components/'));
		 	urls.push(...modelUrls);
		// }
		
	}
	console.log('getPageUrls:', urls);
	return urls;
}

async function getModelPageUrls(modelName: string, request: APIRequestContext): Promise<string[]> {
	// eslint-disable-next-line turbo/no-undeclared-env-vars
	const apiKey = process.env.PUBLIC_BUILDER_API_KEY;

	const response = await request.get(
		`https://cdn.builder.io/api/v3/content/${modelName}?apiKey=${apiKey}&fields=previewUrl&sort.lastUpdated=-1&limit=20`
	);

	const { results } = await response.json();
	const urls: string[] = results.map(
		(item: { previewUrl: string }) => '/' + item.previewUrl.split('/').slice(3).join('/')
	);

	const updatedUrls = urls.map((url) => {
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		if (url.includes('schneider-in-america') && process.env.ENV_POINT === 'PROD') {
			const updatedUrl = url.replace('/ww/en/', '/us/en/');
			console.log('getModelPageUrls: Updated URL:', updatedUrl);
			return updatedUrl;
		}
		return url;
	});

	return updatedUrls;
}
