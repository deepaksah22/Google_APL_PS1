import * as cheerio from 'cheerio';
async function test() {
  const resp = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await resp.text();
  const $ = cheerio.load(html);
  $('a[title*="Delhi Capitals vs Punjab Kings"]').each((i, el) => {
    const parent = $(el).parent();
    console.log("MATCH DATA FOUND:");
    console.log("Title:", $(el).attr('title'));
    console.log("Text inside parent:", parent.text());
  });
}
test();
