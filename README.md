# Chat with Llama Vision - p5.js AI Application

A simple, educational chat interface built with p5.js that connects to NVIDIA's Llama Vision AI. Features automatic image analysis of a tree frog photo using the Llama 4 Maverick vision model. Perfect for teaching students about API integration, vision AI, asynchronous programming, and creative coding with AI.

![Chat Interface](https://img.shields.io/badge/p5.js-ED225D?style=flat&logo=p5.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![NVIDIA](https://img.shields.io/badge/NVIDIA-76B900?style=flat&logo=nvidia&logoColor=white)

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** installed (v14 or higher) - [Download here](https://nodejs.org/)
- An **NVIDIA API key** - [Get one here](https://build.nvidia.com/)
- A text editor (VS Code recommended)
- A web browser (Chrome, Firefox, Safari, etc.)

## 🚀 Quick Start

### 1. Get an NVIDIA API Key

1. Go to [https://build.nvidia.com/](https://build.nvidia.com/)
2. Sign up or log in with your NVIDIA account
3. Navigate to any model page (e.g., Llama models)
4. Click **Get API Key** and copy your new API key (starts with `nvapi-`)

### 2. Set Up the Project

**Open your terminal** and navigate to this project folder:

```bash
cd "Teaching LLMs/Claude API 1"
```

**Install dependencies:**

```bash
npm install
```

**Configure your API key:**

1. Open the file `config.js`
2. Replace `'your-nvidia-api-key-here'` with your actual API key:

```javascript
const CONFIG = {
  NVIDIA_API_KEY: 'nvapi-your-actual-key-here'
};
```

3. Save the file

> **⚠️ Important:** The `config.js` file is git-ignored for security. Never commit your API key to version control!

### 3. Run the Application

**Start the server:**

```bash
npm start
```

You should see:
```
Server running at http://localhost:3000
Open this URL in your browser to use the chat app
API endpoint available at: http://localhost:3000/api/chat
API Key loaded: Yes
```

**Open your browser** to:
```
http://localhost:3000
```

That's it! You should see the chat interface and automatically get an AI analysis of the frog image. You can then continue chatting with Llama Vision about the image or ask other questions.

## 📁 Project Structure

```
Claude API 1/
├── sketch.js                      # Main p5.js code (chat interface with vision)
├── server.js                      # Node.js proxy server (handles API calls)
├── config.js                      # Your API key (git-ignored)
├── config.example.js              # Example config file (safe to share)
├── index.html                     # HTML page that loads everything
├── package.json                   # Node.js dependencies
├── Picture1.b7f92cc.width-1600... # Frog image for vision analysis
├── .gitignore                     # Prevents sensitive files from being committed
└── README.md                      # This file!
```

## 🎓 How It Works

### The Architecture

```
Browser (p5.js)  →  Local Server (Node.js)  →  NVIDIA API (Llama Vision)
    ↓                      ↓                         ↓
  sketch.js            server.js              Llama 4 Maverick
```

### Automatic Frog Image Analysis

On startup, the application automatically:
1. **Loads the frog image** from the server as base64
2. **Sends it to Llama Vision** with the prompt to analyze the image
3. **Receives detailed analysis** including:
   - Species identification (*Hyla cinerea* - American green treefrog)
   - Color and physical feature description
   - Photography quality assessment
4. **Displays the analysis** in the chat interface

### Chat Flow

1. **User types a message** in the p5.js interface
2. **sketch.js sends** the message to `http://localhost:3000/api/chat`
3. **server.js receives** the request and forwards it to NVIDIA's API
4. **Llama Vision processes** the message and sends back a response
5. **server.js returns** the response to sketch.js
6. **sketch.js displays** Llama's response on the canvas

### Why Use a Server?

Browsers block direct API calls to external services (CORS policy). The Node.js server acts as a "middleman" that:
- Keeps your API key secure (never exposed to the browser)
- Bypasses CORS restrictions
- Could add features like rate limiting or logging

## 🛠️ Troubleshooting

### "Port 3000 already in use"

Another process is using port 3000. Kill it:

```bash
lsof -ti:3000 | xargs kill -9
```

Then run `npm start` again.

### "API Key loaded: No"

Check that:
1. Your `config.js` file exists (copy from `config.example.js` if needed)
2. Your API key is properly formatted with quotes
3. The file is saved

### "404 Not Found" or "Connection refused"

Make sure the server is running:
```bash
npm start
```

You should see the "Server running..." message.

### Messages aren't appearing

1. Check the browser console (F12) for errors
2. Check the terminal where the server is running for errors
3. Verify your API key is valid at [build.nvidia.com](https://build.nvidia.com)

## 🎨 Customization Ideas for Students

### Easy Changes:
- Change colors in `sketch.js` (lines 88, 92)
- Modify canvas size (line 27)
- Change the title text (line 75)
- Adjust message spacing (lines 126, 130)

### Intermediate Challenges:
- Add a "Clear Chat" button
- Save conversation history to localStorage
- Add different colors for different types of messages
- Create a typing animation
- Add message timestamps

### Advanced Projects:
- Add support for streaming responses
- Implement message editing
- Add file upload capability for analyzing your own images
- Create different vision models for different tasks
- Build a voice interface
- Compare responses from different NVIDIA models

## 📚 Learning Resources

- [p5.js Reference](https://p5js.org/reference/)
- [NVIDIA NIM API Documentation](https://docs.api.nvidia.com/)
- [NVIDIA Build Platform](https://build.nvidia.com/)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🔒 Security Notes

- **Never share your API key** publicly
- **Never commit `config.js`** to git (it's already in `.gitignore`)
- The `config.example.js` file is safe to share
- Monitor your API usage at [build.nvidia.com](https://build.nvidia.com)

## 📝 License

This project is intended for educational purposes. Feel free to use, modify, and share!

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to modify and improve this code for your students!

## ❓ Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console for error messages (browser and terminal)
3. Verify your API key is active
4. Make sure Node.js and npm are properly installed

---

**Happy coding! 🚀**
