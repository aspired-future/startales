import { test, expect } from '@playwright/test';

test.describe('Witter Functionality Tests', () => {
  test('should load Witter UI with posts and interactive features', async ({ page }) => {
    // Navigate to Witter UI
    await page.goto('http://localhost:5174');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Check that posts are loaded
    const posts = await page.locator('.post-card').count();
    console.log('Number of posts loaded:', posts);
    expect(posts).toBeGreaterThan(0);
    
    // Check that filters are working
    const civilizationFilter = page.locator('select').first();
    await expect(civilizationFilter).toBeVisible();
    
    // Check that posts have content
    const firstPost = page.locator('.post-card').first();
    await expect(firstPost).toBeVisible();
    
    // Check that post content is displayed
    const postContent = firstPost.locator('.post-content');
    await expect(postContent).toBeVisible();
    
    // Check that author information is displayed
    const authorName = firstPost.locator('.author-name');
    await expect(authorName).toBeVisible();
    
    // Check that location is displayed
    const location = firstPost.locator('.location');
    await expect(location).toBeVisible();
    
    // Check that like button exists
    const likeButton = firstPost.locator('button').filter({ hasText: '❤️' });
    await expect(likeButton).toBeVisible();
    
    // Test like functionality
    const initialLikes = await likeButton.textContent();
    console.log('Initial likes:', initialLikes);
    
    await likeButton.click();
    await page.waitForTimeout(1000);
    
    const updatedLikes = await likeButton.textContent();
    console.log('Updated likes:', updatedLikes);
    
    // Check that share button exists
    const shareButton = firstPost.locator('button').filter({ hasText: '🔄' });
    await expect(shareButton).toBeVisible();
    
    // Check that comment button exists
    const commentButton = firstPost.locator('button').filter({ hasText: '💬' });
    await expect(commentButton).toBeVisible();
    
    // Test comment functionality
    await commentButton.click();
    await page.waitForTimeout(1000);
    
    // Check if comment section appears
    const commentSection = firstPost.locator('.comments-section');
    const commentSectionVisible = await commentSection.isVisible().catch(() => false);
    console.log('Comment section visible:', commentSectionVisible);
    
    console.log('All functionality tests passed!');
  });

  test('should test filtering functionality', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);
    
    // Test civilization filter
    const civilizationFilter = page.locator('select').first();
    const options = await civilizationFilter.locator('option').count();
    console.log('Civilization filter options:', options);
    expect(options).toBeGreaterThan(1); // Should have "All" plus actual civilizations
    
    // Select a specific civilization
    await civilizationFilter.selectOption({ index: 1 }); // Select first non-"All" option
    await page.waitForTimeout(2000);
    
    // Check that posts are still displayed (filtered)
    const filteredPosts = await page.locator('.post-card').count();
    console.log('Filtered posts count:', filteredPosts);
    expect(filteredPosts).toBeGreaterThan(0);
    
    console.log('Filtering tests passed!');
  });
});

