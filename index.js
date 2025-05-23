import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.LINKSHARE_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKSHARE_CLIENT_SECRET;

app.get('/proxy', async (req, res) => {
  const mid = req.query.mid || '35719';
  const page = req.query.page || '1';
  const max = req.query.max || '20';

  // 1. Token al
  const tokenResponse = await fetch("https://api.linksynergy.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return res.status(500).json({ error: "Token alınamadı", response: tokenData });
  }

  const token = tokenData.access_token;

  // 2. Ürünleri çek
  const apiUrl = `https://api.linksynergy.com/productsearch/1.0?mid=${mid}&pagenumber=${page}&max=${max}&language=en_US`;

  const productResponse = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/xml"
    }
  });

  const productXml = await productResponse.text();
  res.setHeader("Content-Type", "application/xml");
  res.send(productXml);
});

app.listen(PORT, () => {
  console.log(`Proxy çalışıyor http://localhost:${PORT}`);
});
