import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.LINKSHARE_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKSHARE_CLIENT_SECRET;

app.get('/proxy', async (req, res) => {
  const mid = req.query.mid || '35719';
  const page = req.query.page || '1';
  const max = req.query.max || '20';

  try {
    const tokenResp = await axios.post(
      'https://api.linksynergy.com/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const token = tokenResp.data.access_token;

    const productResp = await axios.get(
      `https://api.linksynergy.com/productsearch/1.0?mid=${mid}&pagenumber=${page}&max=${max}&language=en_US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/xml'
        }
      }
    );

    res.setHeader('Content-Type', 'application/xml');
    res.send(productResp.data);
  } catch (err) {
    res.status(500).json({ error: 'Hata oluştu', details: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy aktif: http://localhost:${PORT}`);
});
