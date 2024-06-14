
import { test } from '@playwright/test';
import { getUrlsFromJson } from '../../src/builder-api';

const percySnapshot = require('@percy/playwright');

test.setTimeout(120000);

test.describe('Insights all with Builder urls @visual', async () => {
	test(`Test`, async ({ page, request }) => {
		const urls = await getUrlsFromJson(process.env['FILE_PATHS']);
		const strategy = process.env['BASELINE'] === 'true' ? 'oldUrl' : 'newUrl';

		for (const url of urls) {
			try {
				
				console.log('next page -> :', url[strategy]);

				await page.goto(url[strategy]);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: '.se.com' }]);
				page.context().addCookies([{ name: 'OptanonAlertBoxClosed', value: 'test-proposal', path: '/', domain: 'sqe-se-web-platform-enterprise.vercel.app' }]);
				
				await page.waitForLoadState('domcontentloaded', { timeout: 80000 });
				await percySnapshot(page, url.id);
			} catch (error) {
				console.warn('Error:', error);
			}
		}
	});
});