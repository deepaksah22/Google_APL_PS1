import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const res = await fetch('https://corsproxy.io/?https://www.espncricinfo.com/live-cricket-score');
    const html = await res.text();
    console.log("Fetched HTML length:", html.length);
    const $ = cheerio.load(html);
    const matches = [];
    $('.match-info').each((i, el) => {
      matches.push($(el).text());
    });
    console.log("Matches found:", matches.length);
    console.log(matches.slice(0, 3));
  } catch (e) {
    console.log(e);
  }
}
test();
