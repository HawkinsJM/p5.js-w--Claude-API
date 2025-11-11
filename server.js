const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');

// Load API key from config.js
const configContent = fs.readFileSync('./config.js', 'utf8');
const apiKeyMatch = configContent.match(/NVIDIA_API_KEY:\s*["']([^"']+)["']/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1] : null;

if (!API_KEY) {
  console.error('ERROR: Could not find NVIDIA API key in config.js');
  process.exit(1);
}

// Initialize OpenAI client with NVIDIA configuration
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  timeout: 60000, // 60 second timeout
});

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Proxy endpoint for NVIDIA Llama API
app.post('/api/chat', async (req, res) => {
  console.log('Received request to /api/chat');
  try {
    // Convert Anthropic-style messages to OpenAI format
    const messages = req.body.messages || [];

    const completion = await openai.chat.completions.create({
      model: "meta/llama-4-scout-17b-16e-instruct",
      messages: messages,
      temperature: req.body.temperature || 1,
      top_p: req.body.top_p || 1,
      max_tokens: req.body.max_tokens || 512,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    });

    // Convert OpenAI response to Anthropic-style format for compatibility
    const response = {
      id: completion.id,
      type: 'message',
      role: 'assistant',
      content: [{
        type: 'text',
        text: completion.choices[0]?.message?.content || ''
      }],
      model: completion.model,
      stop_reason: completion.choices[0]?.finish_reason || 'end_turn',
      usage: {
        input_tokens: completion.usage?.prompt_tokens || 0,
        output_tokens: completion.usage?.completion_tokens || 0
      }
    };

    res.json(response);
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
