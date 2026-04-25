const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import * as cheerio from 'cheerio';

async function test() {
  try {
    const res = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const matches = [];
    $('.cb-mtch-lst').each((i, el) => {
        matches.push($(el).text().trim());
    });
    console.log("Matches found:", matches.length);
    console.log(matches.slice(0, 2));
  } catch (e) {
    console.log(e);
  }
}
test();
