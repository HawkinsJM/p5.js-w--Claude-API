const OpenAI = require("openai");
const fs = require("fs");

// Load API key from config.js
const configContent = fs.readFileSync("./config.js", "utf8");
const apiKeyMatch = configContent.match(/NVIDIA_API_KEY:\s*["']([^"']+)["']/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1] : null;

console.log("API Key:", API_KEY ? "Found" : "Not found");
console.log("API Key starts with:", API_KEY ? API_KEY.substring(0, 10) : "N/A");

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
  timeout: 30000 // 30 second timeout
});

async function test() {
  console.log("\nTesting NVIDIA API...\n");

  try {
    console.log("Making request...");
    const completion = await openai.chat.completions.create({
      model: "meta/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            "you are a little baby who is mad about there being too many balloons in your room. tell me about the ballons every chance you get."
        },
        { role: "user", content: "Say hello in one sentence" }
      ],
      temperature: 1,
      top_p: 1,
      max_tokens: 100,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    });

    console.log("Success!");
    console.log("Response:", completion.choices[0]?.message?.content);
    console.log("\nFull response:", JSON.stringify(completion, null, 2));
  } catch (error) {
    console.error("\n=== ERROR ===");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Type:", error.type);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.error(
      "\nFull error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  }
}

test();
