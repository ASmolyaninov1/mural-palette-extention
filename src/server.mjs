import captureWebsite from 'capture-website';
import ColorThief from 'colorthief';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
}));


app.post('/api/get-palette', async (req, res) => {
  const body = req.body;
  const brandUrl = body?.brandUrl;

  if (!brandUrl) {
    res.status(400).send({ status: 400, message: 'Please provide field brandUrl' });
    return
  };

  const filename = brandUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = `./src/${filename}.png`;

  try {
    await captureWebsite.file(brandUrl, filePath, { fullPage: true });
  } catch (err) {
    res.status(400).send({ status: 400, message: 'Invalid brand url' });
    return
  };

  ColorThief.getPalette(filePath)
    .then(palette => {
      res.status(200).send(palette);
    })
    .catch(e => {
      res.status(500).send('Get palette error')
    });

  fs.unlink(filePath, err => console.log('File remove error => ', err));
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(port, () => console.log('Server listen on port ' + port));

