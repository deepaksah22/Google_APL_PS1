import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as cheerio from 'cheerio';

const liveScorePlugin = () => ({
  name: 'live-score-api',
  configureServer(server) {
    server.middlewares.use('/api/live', async (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      try {
        const resp = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = await resp.text();
        const $ = cheerio.load(html);
        
        let m = {
            id: 'ipl-live',
            title: 'Delhi Capitals vs Punjab Kings',
            team1: { name: 'Delhi Capitals', short: 'DC', runs: '0', wickets: '0', overs: '0.0' },
            team2: { name: 'Punjab Kings', short: 'PBKS', runs: '0', wickets: '0', overs: '0.0' },
            matchStatus: 'LIVE',
            live: true
        };

        $('a[title*="Delhi Capitals vs Punjab Kings"]').each((i, el) => {
          const text = $(el).parent().text();
          if (text.includes('Delhi CapitalsDC')) {
            const t1Match = text.match(/DC(\d+)-(\d+)\s*\((\d+\.?\d*)\)/);
            if (t1Match) {
                m.team1.runs = t1Match[1];
                m.team1.wickets = t1Match[2];
                m.team1.overs = t1Match[3];
            }
            const t2Match = text.match(/PBKS(\d+)-(\d+)\s*\((\d+\.?\d*)\)/);
            if (t2Match) {
                m.team2.runs = t2Match[1];
                m.team2.wickets = t2Match[2];
                m.team2.overs = t2Match[3];
            }
            if (text.includes('Delhi Capitals opt to bat')) m.matchStatus = 'DC opt to bat';
            if (text.includes('Punjab Kings opt to bowl')) m.matchStatus = 'PBKS opt to bowl';
            if (text.match(/(DC|PBKS) needs \d+ runs/)) {
                const req = text.match(/(DC|PBKS) needs \d+ runs.*/);
                if (req) m.matchStatus = req[0];
            }
          }
        });

        res.end(JSON.stringify({ status: 'success', data: m }));
      } catch (err) {
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), liveScorePlugin()],
});
