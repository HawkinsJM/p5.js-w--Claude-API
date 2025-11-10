// API Configuration - use local proxy server to avoid CORS
const API_URL = "http://localhost:3000/api/chat";

let inputField;
let submitButton;
let conversationHistory = [];
let isLoading = false;

function setup() {
  createCanvas(800, 600);

  // Create UI elements
  inputField = createInput("");
  inputField.position(20, height - 60);
  inputField.size(width - 140, 30);
  inputField.attribute("placeholder", "Type your message here...");

  submitButton = createButton("Send");
  submitButton.position(width - 100, height - 60);
  submitButton.size(80, 35);
  submitButton.mousePressed(sendMessage);

  // Allow Enter key to send message
  inputField.elt.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  textAlign(LEFT, TOP);
  textSize(14);
}

function draw() {
  background(240);

  // Title
  fill(0);
  textSize(20);
  textStyle(BOLD);
  text("Chat with Claude", 20, 20);

  // Display conversation
  textSize(14);
  textStyle(NORMAL);
  let yPos = 60;

  for (let msg of conversationHistory) {
    // User messages
    if (msg.role === "user") {
      fill(60, 120, 200);
      textStyle(BOLD);
      text("You:", 20, yPos);
      textStyle(NORMAL);
      fill(0);

      let lines = splitText(msg.content, width - 40);
      for (let line of lines) {
        yPos += 20;
        text(line, 20, yPos);
      }
      yPos += 30;
    }
    // Claude's responses
    else if (msg.role === "assistant") {
      fill(200, 60, 120);
      textStyle(BOLD);
      text("Claude:", 20, yPos);
      textStyle(NORMAL);
      fill(0);

      let lines = splitText(msg.content, width - 40);
      for (let line of lines) {
        yPos += 20;
        text(line, 20, yPos);
      }
      yPos += 30;
    }
  }

  // Loading indicator
  if (isLoading) {
    fill(100);
    textStyle(ITALIC);
    text("Claude is typing...", 20, yPos);
  }

  // Scroll indicator if content overflows
  if (yPos > height - 100) {
    fill(255, 0, 0);
    textStyle(NORMAL);
    textAlign(RIGHT);
    text("(Scroll up to see more)", width - 20, height - 100);
    textAlign(LEFT);
  }
}

async function sendMessage() {
  if (isLoading || inputField.value().trim() === "") return;

  let userMessage = inputField.value().trim();
  inputField.value("");

  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  isLoading = true;

  try {
    // Call Anthropic API via proxy server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Add Claude's response to history
    if (data.content && data.content[0]) {
      conversationHistory.push({
        role: "assistant",
        content: data.content[0].text
      });
    }
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    conversationHistory.push({
      role: "assistant",
      content: "Error: " + error.message
    });
  }

  isLoading = false;
}

// Helper function to split text into lines that fit the canvas width
function splitText(txt, maxWidth) {
  let words = txt.split(" ");
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    let testLine = currentLine + word + " ";
    if (textWidth(testLine) > maxWidth && currentLine !== "") {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.trim() !== "") {
    lines.push(currentLine.trim());
  }

  return lines;
}
