/**
 * @fileoverview Playwright spec covering a basic Amazon add-to-cart flow.
 *
 * Preconditions:
 * - Test runner has network access to https://www.amazon.com
 * - No authentication is required for adding an item to cart (guest cart)
 * - Locale/consent interstitials may appear; the test attempts to dismiss them when present.
 */

import { test, expect } from '@test-setup/fixtures';
import { AmazonPage } from '@/pages/amazon.page';

/**
 * Amazon add-to-cart test.
 *
 * Intent: Navigate to Amazon, search for "Wireless Mouse", open the recorded product,
 * add it to the cart, then verify the cart contains the expected product and quantity.
 */
test('Amazon - add Wireless Mouse to cart and verify cart contents', async ({ page, logger }) => {
    const amazonPage = new AmazonPage(page);

    await test.step('Navigate to Amazon home', async () => {
        logger.info('Navigating to Amazon home page');
        await page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded' });
    });

    await test.step('Verify Amazon home page loaded', async () => {
        logger.info('Verifying Amazon home page is loaded');
        await expect(page).toHaveURL(/amazon\.com/);
        await expect(page).toHaveTitle(/Amazon/i);
    });

    await test.step('Dismiss interstitial if present (Continue shopping)', async () => {
        logger.info("Attempting to dismiss interstitial via 'Continue shopping' if it appears");
        const btn = page.getByRole('button', { name: 'Continue shopping' });
        if (await btn.isVisible().catch(() => false)) {
            await amazonPage.clickContinueShopping();
        }
    });

    await test.step('Search for Wireless Mouse', async () => {
        logger.info('Filling search box with query: Wireless Mouse');
        await amazonPage.fillSearchAmazon('Wireless Mouse');

        logger.info("Submitting search via 'Go' button");
        await amazonPage.clickSearchGo();
    });

    await test.step('Open recorded product from results', async () => {
        logger.info('Opening recorded product link from search results');
        await amazonPage.clickRecordedProductLink();
    });

    await test.step('Add product to cart', async () => {
        logger.info("Clicking 'Add to cart'");
        await amazonPage.clickAddToCart();
    });

    await test.step('Open cart', async () => {
        logger.info('Opening cart (placeholder method in AmazonPage)');
        await amazonPage.openCart();
    });

    await test.step('Verify cart contains expected product and quantity', async () => {
        logger.info('Verifying cart contains expected product and quantity (placeholder method in AmazonPage)');
        await amazonPage.verifyCartHasProductAndQuantity('Logitech M185 Wireless Mouse', 1);
    });
});
