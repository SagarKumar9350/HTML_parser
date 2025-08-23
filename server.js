
import http from 'http';
import https from 'https';

const hostname = "127.0.0.1";
const port = 3000;

// Fetch RSS Feed
function fetchHomepage() {
  return new Promise((resolve, reject) => {
    const req = https.request(
      "https://time.com/feed/",
      {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Encoding": "identity", 
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error("Non-200 status code: " + res.statusCode));
          return;
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.end();
  });
}

//Parsing the stories
function parseLatestSix(xml) {
  const regex =
    /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>(https:\/\/time\.com\/[^<]+)<\/link>/g;

  let match;
  let stories = [];

  while ((match = regex.exec(xml)) !== null && stories.length < 6) {
    let title = match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    let link = match[2].trim();

    if (title && link && link.includes("time.com")) {
      stories.push({ title, link });
    }
  }

  return stories;
}

// routes
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is the home page");

  } else if (req.url === "/getTimeStories") {
    try {
      const xml = await fetchHomepage();
      const stories = parseLatestSix(xml);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      // console.log(stories);
      res.end(JSON.stringify(stories, null, 2));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/getTimeStories`);
});
