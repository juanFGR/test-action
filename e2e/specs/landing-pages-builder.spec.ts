
import { test } from '@playwright/test';

const percySnapshot = require('@percy/playwright');

test.setTimeout(120000);

test.describe('Check Landing Pages in Builder.io @visual', async () => {
	test(`Test`, async ({ page, request }) => {
		let urls = [
			'/uk/en/food-and-beverage-test-PF/',
			'/de/de/machine-builder-test/',
			'/fr/fr/real-estate-test/',
		];

		if(process.env['ENV'] == 'PROD'){
			urls = [	
				'/uk/en/work/solutions/for-business/food-and-beverage',
				'/fr/fr/work/solutions/for-business/real-estate',
				'/de/de/work/solutions/machine-builder'
			];

		}


		for (const url of urls) {
			try {
				let pageUrl = process.env['BASE_URL'] + url;
				console.log('next page -> :', pageUrl);

				await page.goto(pageUrl);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: '.se.com' }]);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: 'sqe-se-web-platform-enterprise.vercel.app' }]);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: 'pre-se-web-platform-enterprise.vercel.app' }]);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: 'se-web-platform-enterprise.vercel.app' }]);

				await page.waitForLoadState('domcontentloaded', { timeout: 80000 });
				await percySnapshot(page, url);
			} catch (error) {
				console.warn('Error:', error);
			}
		}
	});
});