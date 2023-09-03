const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.json());

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    if (response.status === 200) {
      const data = response.data;
      return data.numbers || [];
    }
  } catch (error) {
    // Ignore timeouts or invalid URLs
  }
  return [];
}

app.get('/numbers', async (req, res) => {
  const urls = req.query.url || [];
  const mergedNumbers = [];

  try {
    const promises = urls.map(fetchNumbersFromUrl);
    const results = await Promise.all(promises);

    for (const numbers of results) {
      mergedNumbers.push(...numbers);
    }

    const uniqueNumbers = [...new Set(mergedNumbers)];
    const sortedUniqueNumbers = uniqueNumbers.sort((a, b) => a - b);

    res.json({ numbers: sortedUniqueNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Number Management Service is running on port ${port}`);
});