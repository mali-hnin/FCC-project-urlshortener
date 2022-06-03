require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');
// array of urls to retrieve short_url outside of post method for redirects:
const urlsArr = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
//app.use(router());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const origURL = String(req.body.url)
  const urlObject = new URL(req.body.url)
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({error: "invalid url"});
    } else {
      const shortURL = Math.floor(Math.random() * 10000).toString();
      const storedURLObj = {
        original_url: origURL,
        short_url: shortURL
      };
      urlsArr.push(storedURLObj);
      res.json({original_url: origURL, short_url: shortURL});
    }
  })
});

app.get('/api/shorturl/:url', (req, res) => {
  const currentURL = urlsArr.find((i)=> i.short_url === req.params.url);
  res.redirect(currentURL.original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
