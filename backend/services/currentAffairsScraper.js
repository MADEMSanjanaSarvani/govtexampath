const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const CurrentAffair = require('../models/CurrentAffair');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const SOURCES = [
  {
    name: 'PIB Press Releases',
    url: 'https://pib.gov.in/allRel.aspx',
    sourceLabel: 'PIB',
  },
  {
    name: 'PIB Press Information Bureau',
    url: 'https://pib.gov.in/PressReleasePage.aspx',
    sourceLabel: 'PIB',
  },
];

const CATEGORY_KEYWORDS = {
  Economy: ['gdp', 'rbi', 'repo rate', 'inflation', 'fiscal', 'budget', 'tax', 'economy', 'economic', 'finance', 'banking', 'sebi', 'stock', 'sensex', 'nifty', 'trade', 'export', 'import', 'fdi', 'upi', 'digital rupee', 'monetary policy', 'gst'],
  Defence: ['defence', 'defense', 'army', 'navy', 'air force', 'missile', 'drdo', 'military', 'ins ', 'ias ', 'bro ', 'agni', 'brahmos', 'tejas', 'hal ', 'nda ', 'cds ', 'afcat'],
  Science: ['isro', 'space', 'satellite', 'chandrayaan', 'gaganyaan', 'science', 'technology', 'digital', 'ai ', 'artificial intelligence', 'quantum', 'iit ', 'research', 'nuclear', 'reactor'],
  Sports: ['cricket', 'olympic', 'medal', 'championship', 'athletics', 'asian games', 'world cup', 'icc ', 'bcci', 'hockey', 'badminton', 'wrestling', 'shooting', 'football'],
  Environment: ['climate', 'monsoon', 'environment', 'pollution', 'green', 'renewable', 'solar', 'hydrogen', 'ev ', 'electric vehicle', 'carbon', 'emission', 'forest', 'wildlife'],
  International: ['g20', 'un ', 'united nations', 'brics', 'bilateral', 'summit', 'treaty', 'foreign', 'diplomatic', 'who ', 'imf ', 'world bank', 'indo-', 'india-us', 'india-japan', 'india-eu'],
  Education: ['upsc', 'ssc', 'ibps', 'neet', 'jee', 'nta', 'ugc', 'ctet', 'university', 'education', 'exam result', 'cutoff', 'answer key', 'admit card'],
  Health: ['health', 'medical', 'hospital', 'disease', 'vaccine', 'malaria', 'tb ', 'tuberculosis', 'aiims', 'who certified', 'pandemic'],
};

function categorizeArticle(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  let bestCategory = 'National';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(kw => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    },
    timeout: 30000,
    maxRedirects: 5,
    httpsAgent,
  });
  return response.data;
}

/**
 * Scrape PIB press releases and create CurrentAffair entries.
 */
async function scrapePIB() {
  const articles = [];

  for (const source of SOURCES) {
    try {
      const html = await fetchPage(source.url);
      const $ = cheerio.load(html);

      // PIB uses various structures for press releases
      $('a').each((_, elem) => {
        const $a = $(elem);
        const text = $a.text().trim().replace(/\s+/g, ' ');
        const href = $a.attr('href') || '';

        if (text.length > 30 && text.length < 500 && href) {
          // Filter for press release links
          const lowerText = text.toLowerCase();
          const isRelevant = !lowerText.includes('skip to') && !lowerText.includes('sitemap') &&
            !lowerText.includes('privacy policy') && !lowerText.includes('terms') &&
            text.match(/[A-Z]/) && !text.match(/^[0-9\s]+$/);

          if (isRelevant) {
            articles.push({
              title: text.substring(0, 300),
              source: source.sourceLabel,
              sourceUrl: href.startsWith('http') ? href : `https://pib.gov.in/${href}`,
            });
          }
        }
      });

      console.log(`[CA Scraper] Found ${articles.length} potential articles from ${source.name}`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`[CA Scraper] Error scraping ${source.name}:`, err.message);
    }
  }

  return articles.slice(0, 30);
}

/**
 * Process scraped articles and save new ones to database.
 */
async function processAndSaveArticles(articles) {
  let saved = 0;
  let skipped = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const article of articles) {
    try {
      // Check if article already exists (by title similarity)
      const existing = await CurrentAffair.findOne({
        title: { $regex: article.title.substring(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' },
        publishDate: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
      });

      if (existing) {
        skipped++;
        continue;
      }

      const category = categorizeArticle(article.title, article.title);
      const categoryLower = category.toLowerCase();
      const validCategories = ['national', 'international', 'economy', 'science', 'sports', 'defence', 'environment', 'education', 'health', 'other'];
      const finalCategory = validCategories.includes(categoryLower) ? categoryLower : 'other';

      await CurrentAffair.create({
        title: article.title,
        content: article.title,
        category: finalCategory,
        source: article.source || 'PIB',
        publishDate: new Date(),
        tags: [article.source || 'PIB', category],
      });

      saved++;
    } catch (err) {
      console.error(`[CA Scraper] Error saving article:`, err.message);
    }
  }

  console.log(`[CA Scraper] Saved ${saved} new articles, skipped ${skipped} duplicates.`);
  return { saved, skipped };
}

/**
 * Main function to run current affairs scraping.
 */
async function runCurrentAffairsScrape() {
  console.log(`[CA Scraper] Starting current affairs scrape at ${new Date().toISOString()}`);

  try {
    const articles = await scrapePIB();

    if (articles.length === 0) {
      console.log('[CA Scraper] No new articles found.');
      return { saved: 0, skipped: 0 };
    }

    const result = await processAndSaveArticles(articles);
    console.log(`[CA Scraper] Completed. ${result.saved} new articles added.`);
    return result;
  } catch (err) {
    console.error('[CA Scraper] Fatal error:', err.message);
    return { saved: 0, skipped: 0, error: err.message };
  }
}

module.exports = { runCurrentAffairsScrape, scrapePIB, categorizeArticle };
