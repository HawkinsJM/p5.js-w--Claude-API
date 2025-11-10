const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');

// Load API key from config.js
const configContent = fs.readFileSync('./config.js', 'utf8');
const apiKeyMatch = configContent.match(/ANTHROPIC_API_KEY:\s*["']([^"']+)["']/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1] : null;

if (!API_KEY) {
  console.error('ERROR: Could not find API key in config.js');
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Proxy endpoint for Anthropic API
app.post('/api/chat', async (req, res) => {
  console.log('Received request to /api/chat');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser to use the chat app');
  console.log(`API endpoint available at: http://localhost:${PORT}/api/chat`);
  console.log(`API Key loaded: ${API_KEY ? 'Yes' : 'No'}`);
});
