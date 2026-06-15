import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function expectNoA11yViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast'])
    .analyze();
  expect(results.violations).toEqual([]);
}

test('home exposes primary content areas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /수학, 어떻게 공부해야 할까요/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /학부모 가이드 보기/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: '추천 학부모 가이드' })).toBeVisible();
  await expectNoA11yViolations(page);
});

test('guides list supports filtering', async ({ page }) => {
  await page.goto('/guides');
  await expect(page.getByRole('heading', { name: '학부모 가이드' })).toBeVisible();
  await page.getByPlaceholder('제목/요약 검색').fill('시험');
  await page.getByRole('button', { name: '필터 적용' }).click();
  await expect(page.getByText(/검색 결과|총/)).toBeVisible();
  await expect(page.getByRole('link', { name: /시험/ }).first()).toBeVisible();
});

test('guide detail renders article content', async ({ page }) => {
  await page.goto('/guides/after-test-child-only-says-next-time-better');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('시험 뒤');
  await expect(page.getByText('최근 읽은 글').first()).toBeVisible();
  await expectNoA11yViolations(page);
});

test('concept detail renders article content', async ({ page }) => {
  await page.goto('/concepts/achievement-emotion');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('짧은 정의')).toBeVisible();
});

test('search finds metacognition content', async ({ page }) => {
  await page.goto('/search?q=메타인지');
  await expect(page.getByRole('heading', { name: '검색' })).toBeVisible();
  await expect(page.getByText(/검색 결과/)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('#search-results a').first()).toBeVisible();
});
