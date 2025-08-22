import { createServer } from 'node:http';
import https from "https";

const hostname = '127.0.0.1';
const port = 3000;

const data =   [
    {
    "title": "Amy Schneider’s Jeopardy! Streak Ends at 40 Consecutive Wins and $1.4 Million",
    "link": "https://time.com/6142934/amy-schneider-jeopardy-streak-ends/"
    },
    {
    "title": "'Writing With Fire' Shines a Light on All-Women News Outlet",
    "link": "https://time.com/6142628/writing-with-fire-india-documentary/"
    },
    {
    "title": "Moderna Booster May Wane After 6 Months",
    "link": "https://time.com/6142852/moderna-booster-wanes-omicron/"
    },
    {
    "title": "Pressure Mounts for Biden to Nominate a Black Woman to the Supreme",
    "link":"https://time.com/6142743/joe-biden-supreme-court-nominee-black-woman-campaignpromise/"
    },
    {
    "title": "The James Webb Space Telescope Is in Position—And Now We Wait",
    "link": "https://time.com/6142769/james-webb-space-telescope-reaches-l2/"
    },
    {
    "title": "We Urgently Need a New National COVID-19 Response Plan",
    "link": "https://time.com/6142718/we-need-new-national-covid-19-response-plan/"
    }
    ]

const jsondata = JSON.stringify(data);


function fetchHomepage() {
  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://time.com',
      { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity' } },
      res => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

const server = createServer(async (req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('This is the home page');
    } else if (req.url === '/getTimeStories') {
        const fetcheddata = await fetchHomepage().then(val =>val).catch(err => console.log(err));
        console.log(fetcheddata);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(jsondata);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Page Not Found \n');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
