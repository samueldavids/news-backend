const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/news", async (req, res) => {
  const keyword = req.query.q || "";
  const source = req.query.source || "https://berita-indo-api-next.vercel.app/api/antara-news/";

  try {
    const response = await axios.get(source);
    const allNews = response.data.data || [];

    const filtered = allNews.filter(article =>
      article.title.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json({
      total: filtered.length,
      articles: filtered.map(item => ({
        title: item.title,
        link: item.link,
        summary: item.description || item.title,
        date: item.pubDate || item.isoDate
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
