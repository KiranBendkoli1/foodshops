import { defineConfig } from 'unlighthouse';

export default defineConfig({
  // Providing an explicit list of URLs disables the sitemap and link crawler
  // This is required for SPAs where links may not be easily crawlable
  urls: [
    '/',
    '/login',
    '/signup',
  ],
  scanner: {
    device: 'desktop',
    samples: 1,
    skipJavascript: false, // Ensure JS is enabled for React rendering
  },
  // Lighthouse options to improve SPA results
  lighthouseOptions: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    // Ensure the crawler waits for the dynamic content to render
    // wait: 2000, 
  },
  // Ensure we wait for React to hydrate
  hooks: {
    'worker:before-run': async (page) => {
      // Small wait for JS to execute
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
  debug: true,
});
