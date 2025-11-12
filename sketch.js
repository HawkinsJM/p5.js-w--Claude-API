/*
 * CHAT WITH LLAMA - A p5.js + AI Application
 * This sketch creates a chat interface where users can talk with Llama AI
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

// Where to send our messages (our server acts as a middleman to Llama)
const API_URL = "http://localhost:3000/api/chat";

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

let inputField; // Text box where user types
let submitButton; // Button to send messages
let conversationHistory = []; // Array storing all messages back and forth
let isLoading = false; // Are we waiting for Llama to respond?
let frogImageData = null; // Base64 encoded frog image
let initialMessageSent = false; // Track if we've sent the initial frog analysis
let particles = []; // Array of word particles floating on screen

// =============================================================================
// SETUP - Runs once when the program starts
// =============================================================================

function setup() {
  createCanvas(800, 600);

  // Create text input box at bottom of screen
  inputField = createInput("");
  inputField.position(20, height - 60);
  inputField.size(width - 140, 30);
  inputField.attribute("placeholder", "Type your message here...");

  // Create send button next to input box
  submitButton = createButton("Send");
  submitButton.position(width - 100, height - 60);
  submitButton.size(80, 35);
  submitButton.mousePressed(sendMessage); // When clicked, call sendMessage()

  // Allow Enter key to send message (instead of clicking button)
  inputField.elt.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Set default text settings
  textAlign(LEFT, TOP);
  textSize(14);

  // Load the frog image on startup
  loadFrogImage();
}

// =============================================================================
// DRAW - Runs 60 times per second, displays everything on screen
// =============================================================================

function draw() {
  background(240); // Light gray background

  // Draw title at top
  drawTitle();

  // Draw all messages in the conversation
  drawConversation();
}

// =============================================================================
// HELPER FUNCTIONS FOR DRAWING
// =============================================================================

// Particle class for word particles
class Particle {
  constructor(word, x, y, isUser) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2); // Horizontal velocity
    this.vy = random(-3, -1); // Vertical velocity (moves up)
    this.alpha = 255; // Opacity
    this.lifetime = 300; // Frames before particle fades
    this.age = 0;
    this.isUser = isUser; // Color based on user or assistant
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;

    // Fade out over time
    this.alpha = 255 * (1 - this.age / this.lifetime);

    // Gravity effect
    this.vy += 0.05;
  }

  display() {
    push();
    textAlign(CENTER, CENTER);
    textSize(12);

    if (this.isUser) {
      fill(60, 120, 200, this.alpha); // Blue for user
    } else {
      fill(200, 60, 120, this.alpha); // Pink for assistant
    }

    text(this.word, this.x, this.y);
    pop();
  }

  isDead() {
    return this.age >= this.lifetime;
  }
}

function updateAndDrawParticles() {
  // Update all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isDead()) {
      particles.splice(i, 1); // Remove dead particles
    }
  }
}

function drawTitle() {
  fill(0);
  textSize(20);
  textStyle(BOLD);
  text("Chat with Llama", 20, 20);
}

function drawConversation() {
  textSize(14);
  textStyle(NORMAL);
  let yPos = 60; // Start position for messages

  // Loop through all messages and display them
  for (let msg of conversationHistory) {
    if (msg.role === "user") {
      // Draw user messages in blue
      yPos = drawMessage("You:", msg.content, yPos, color(60, 120, 200));
    } else if (msg.role === "assistant") {
      // Draw Llama's messages in pink
      yPos = drawMessage("Llama:", msg.content, yPos, color(200, 60, 120));
    }
  }

  // Show "typing..." indicator while waiting for response
  if (isLoading) {
    fill(100);
    textStyle(ITALIC);
    text("Llama is typing...", 20, yPos);
  }

  // Warn if conversation is too long to see on screen
  if (yPos > height - 100) {
    fill(255, 0, 0);
    textStyle(NORMAL);
    textAlign(RIGHT);
    text("(Scroll up to see more)", width - 20, height - 100);
    textAlign(LEFT);
  }
}

function drawMessage(sender, content, yPosition, senderColor) {
  // Draw sender name in color
  fill(senderColor);
  textStyle(BOLD);
  text(sender, 20, yPosition);

  // Draw message content in black
  textStyle(NORMAL);
  fill(0);

  // Split long text into multiple lines
  let lines = splitText(content, width - 40);
  let isUser = sender === "You:";

  for (let line of lines) {
    yPosition += 20; // Move down for each line
    text(line, 20, yPosition);

    // Create particles for each word in this line
    let words = line.split(" ");
    for (let word of words) {
      if (word.trim() !== "") {
        let p = new Particle(word, random(20, width - 40), yPosition, isUser);
        particles.push(p);
      }
    }
  }

  yPosition += 30; // Extra space before next message
  return yPosition;
}

// =============================================================================
// LOADING FROG IMAGE
// =============================================================================

async function loadFrogImage() {
  try {
    const response = await fetch("http://localhost:3000/api/frog-image");
    const data = await response.json();
    frogImageData = data.image;

    // Automatically send initial message with frog image
    setTimeout(() => {
      sendInitialFrogAnalysis();
    }, 500);
  } catch (error) {
    console.error("Error loading frog image:", error);
  }
}

async function sendInitialFrogAnalysis() {
  if (initialMessageSent || !frogImageData) return;

  initialMessageSent = true;
  isLoading = true;

  // Add system message to show we're analyzing
  conversationHistory.push({
    role: "user",
    content:
      "Please analyze this frog image and provide detailed feedback about the species, colors, and photography quality."
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this frog image and provide detailed feedback about the species, colors, and photography quality."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${frogImageData}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.content && data.content[0]) {
      conversationHistory.push({
        role: "assistant",
        content: data.content[0].text
      });
    }
  } catch (error) {
    console.error("Error analyzing frog image:", error);
    conversationHistory.push({
      role: "assistant",
      content: "Error: " + error.message
    });
  }

  isLoading = false;
}

// =============================================================================
// SENDING MESSAGES TO LLAMA
// =============================================================================

async function sendMessage() {
  // Don't send if we're already waiting or if input is empty
  if (isLoading || inputField.value().trim() === "") {
    return;
  }

  // Get the user's message and clear the input box
  let userMessage = inputField.value().trim();
  inputField.value("");

  // Add user's message to conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  // Show loading indicator
  isLoading = true;

  try {
    // Send request to our server (which talks to Llama)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929", // Which AI model to use
        max_tokens: 1024, // Maximum length of response
        messages: conversationHistory // All previous messages
      })
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Get Llama's response
    const data = await response.json();

    // Add Llama's response to conversation history
    if (data.content && data.content[0]) {
      conversationHistory.push({
        role: "assistant",
        content: data.content[0].text
      });
    }
  } catch (error) {
    // If something goes wrong, show error message
    console.error("Error calling Anthropic API:", error);
    conversationHistory.push({
      role: "assistant",
      content: "Error: " + error.message
    });
  }

  // Hide loading indicator
  isLoading = false;
}

// =============================================================================
// TEXT WRAPPING UTILITY
// =============================================================================

// Split long text into multiple lines so it fits on screen
function splitText(txt, maxWidth) {
  let words = txt.split(" "); // Break text into individual words
  let lines = []; // Store the final lines
  let currentLine = ""; // Build up the current line

  // Try adding each word to the current line
  for (let word of words) {
    let testLine = currentLine + word + " ";

    // If adding this word makes the line too long...
    if (textWidth(testLine) > maxWidth && currentLine !== "") {
      lines.push(currentLine.trim()); // Save current line
      currentLine = word + " "; // Start new line with this word
    } else {
      currentLine = testLine; // Add word to current line
    }
  }

  // Don't forget the last line!
  if (currentLine.trim() !== "") {
    lines.push(currentLine.trim());
  }

  return lines;
}
