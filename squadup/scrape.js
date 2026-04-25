import * as cheerio from 'cheerio';

async function scrape() {
  try {
    const resp = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await resp.text();
    const $ = cheerio.load(html);
    let result = null;
    $('.cb-mtch-lst').each((i, el) => {
       const title = $(el).find('h3').text();
       const scoreBat = $(el).find('.cb-hm-scg-bat-txt').text();
       const scoreBowl = $(el).find('.cb-hm-scg-bwl-txt').text();
       const status = $(el).find('.cb-text-live, .cb-text-complete').text();
       if (title) console.log(title);
       if (title.includes('Delhi') || title.includes('Punjab') || title.includes('DC') || title.includes('PBKS')) {
         result = { title, scoreBat, scoreBowl, status };
       }
    });
    console.log("Result:", result);
  } catch(e) { console.error(e); }
}
scrape();
