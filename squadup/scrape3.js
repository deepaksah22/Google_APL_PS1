import * as cheerio from 'cheerio';
async function test() {
  const resp = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await resp.text();
  const $ = cheerio.load(html);
  let found = false;
  $('a[title*="Delhi Capitals vs Punjab Kings"]').each((i, el) => {
    const parent = $(el).parent();
    const text = parent.text();
    if (text.includes('Delhi CapitalsDC')) {
      const matchText = text;
      console.log("Found match text:", matchText);
      // Example text: "35th Match • Delhi, Arun Jaitley StadiumDelhi CapitalsDC234-1 (17.5)Punjab KingsPBKSDelhi Capitals opt to batLive Score |Scorecard |Full Commentary |News"
      const t1Match = matchText.match(/DC(\d+-\d+)\s*\((\d+\.?\d*)\)/);
      const t2Match = matchText.match(/PBKS(\d+-\d+)\s*\((\d+\.?\d*)\)/);
      
      console.log("T1 Match:", t1Match);
      console.log("T2 Match:", t2Match);
      found = true;
    }
  });
  if (!found) console.log("Match container not found.");
}
test();
