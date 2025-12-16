import { useState, useRef, useEffect } from "react";
import { addMessage } from "../utils/chatbotData";
import Loader from "../components/Loader";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Cyber Boy, your cybersecurity assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("cyberboy_session_id") || null;
  });
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    const userInput = input.trim();
    setInput("");
    setError(null);

    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    const sessionResult = await addMessage(userMessage, sessionId);
    if (!sessionId && sessionResult && sessionResult._id) {
      setSessionId(sessionResult._id);
      localStorage.setItem("cyberboy_session_id", sessionResult._id);
    }
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey || apiKey === "free") {
        throw new Error(
          "OpenRouter API key required. Get a FREE API key: 1) Go to https://openrouter.ai 2) Sign up (free) 3) Get your API key 4) Add VITE_OPENROUTER_API_KEY=your_key to .env file"
        );
      }

      const apiMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      apiMessages.push({
        role: "user",
        content: userInput,
      });

      // Use proxy in development, real API in production
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const apiUrl = isLocal
        ? "/api/openrouter/v1/chat/completions"
        : "https://openrouter.ai/api/v1/chat/completions";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Cyber Assistant",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat", // DeepSeek model via OpenRouter
          messages: [
            {
              role: "system",
              content:
                "You are a helpful cybersecurity assistant named Cyber Boy. Provide clear, accurate, and helpful responses about cybersecurity topics, best practices, and general security advice. Use plain text only - do not use markdown symbols like *, _, `, or #. If you need to indicate headers or important sections, use **text** format for headers which will be displayed as bold.",
            },
            ...apiMessages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error?.message ||
          errorData.message ||
          `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let botResponse =
        data.choices[0]?.message?.content ||
        "Sorry, I could not generate a response.";

      botResponse = botResponse
        // Convert markdown headers with special markers
        .replace(/^#\s+(.+)$/gm, (match, header) => `[H1]${header.trim()}[/H1]`) // Main header (large)
        .replace(
          /^##\s+(.+)$/gm,
          (match, header) => `[H2]${header.trim()}[/H2]`
        ) // Secondary header (large)
        .replace(
          /^###+\s+(.+)$/gm,
          (match, header) => `[H3]${header.trim()}[/H3]`
        ) // Subheading (medium)
        // Remove other markdown symbols
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove double ** bold (we'll use our header format)
        .replace(/\*(.+?)\*/g, "$1") // Remove single * italic
        .replace(/_(.+?)_/g, "$1") // Remove _ italic
        .replace(/`(.+?)`/g, "$1") // Remove ` code
        .replace(/~~(.+?)~~/g, "$1") // Remove ~~ strikethrough
        .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links, keep text
        .replace(/^[-*+]\s+/gm, "") // Remove list markers
        .replace(/^\d+\.\s+/gm, ""); // Remove numbered list markers

      setIsLoading(false);

      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        text: botResponse,
        sender: "bot",
      };
      setMessages((prev) => [...prev, { ...botMessage, text: "" }]);

      let currentIndex = 0;
      let messageSaved = false;
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < botResponse.length) {
          const currentText = botResponse.substring(0, currentIndex + 1);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: currentText } : msg
            )
          );
          currentIndex++;
          scrollToBottom();

          // Save complete message when typing finishes (only once)
          if (currentIndex === botResponse.length && !messageSaved) {
            addMessage(botMessage, sessionId);
            messageSaved = true;
          }
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }
      }, 20); // Adjust speed: lower = faster, higher = slower (20ms = ~50 chars/sec)
    } catch (err) {
      console.error("Chatbot Error:", err);
      let errorMessage = "Connection error occurred";

      if (err.message) {
        errorMessage = err.message;

        if (
          err.message.toLowerCase().includes("balance") ||
          err.message.toLowerCase().includes("insufficient") ||
          err.message.toLowerCase().includes("credit")
        ) {
          errorMessage =
            "⚠️ Insufficient balance. Please add credits to your OpenRouter account at https://openrouter.ai to continue using the chatbot.";
        }
      } else if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      setError(errorMessage);
      const errorMessageObj = {
        id: Date.now() + 1,
        text: `Error: ${errorMessage}`,
        sender: "bot",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessageObj]);
      addMessage(errorMessageObj);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 sm:px-0">
      {/* Header */}
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Cyber Boy Chat
        </h1>
        <p className="text-xs sm:text-sm text-purple-300">
          Your AI-powered cybersecurity assistant
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85vw] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                message.isError
                  ? "bg-red-600/80 text-white"
                  : message.sender === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700/80 text-gray-100 backdrop-blur-sm"
              }`}
            >
              <div className="text-xs sm:text-sm whitespace-pre-wrap">
                {message.text.split("\n").map((line, index) => {
                  const trimmedLine = line.trim();

                  if (
                    trimmedLine.startsWith("[H1]") &&
                    trimmedLine.endsWith("[/H1]")
                  ) {
                    const headerText = trimmedLine.slice(4, -5);
                    return (
                      <div
                        key={index}
                        className="font-bold text-lg mb-2 mt-3 first:mt-0"
                      >
                        {headerText}
                      </div>
                    );
                  }

                  if (
                    trimmedLine.startsWith("[H2]") &&
                    trimmedLine.endsWith("[/H2]")
                  ) {
                    const headerText = trimmedLine.slice(4, -5);
                    return (
                      <div
                        key={index}
                        className="font-bold text-lg mb-2 mt-3 first:mt-0"
                      >
                        {headerText}
                      </div>
                    );
                  }

                  if (
                    trimmedLine.startsWith("[H3]") &&
                    trimmedLine.endsWith("[/H3]")
                  ) {
                    const headerText = trimmedLine.slice(4, -5);
                    return (
                      <div
                        key={index}
                        className="font-bold text-base mb-1 mt-2 first:mt-0"
                      >
                        {headerText}
                      </div>
                    );
                  }

                  return <div key={index}>{line || "\u00A0"}</div>;
                })}
              </div>
            </div>
          </div>
        ))}
        {/* Bot typing indicator removed as requested */}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-purple-500/30 px-3 py-3 sm:px-6 sm:py-4">
        <form onSubmit={handleSend} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-700/80 text-white placeholder-gray-400 rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-600 text-xs sm:text-base"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-base"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
