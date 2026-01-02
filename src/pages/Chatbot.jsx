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
    <div className="relative flex flex-col h-[calc(100vh-73px)] bg-cyber-bg cyber-grid-bg px-2 sm:px-0 overflow-hidden">
      {/* Background Decor */}
      <div className="scanline" />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Diagnostics (Visible on large screens) */}
        <div className="hidden lg:flex flex-col w-64 border-r border-cyber-border p-4 space-y-4 font-orbitron text-[10px] uppercase tracking-tighter">
          <div className="cyber-box p-3 border-cyber-accent/50">
            <h3 className="text-cyber-accent mb-2 cyber-text-glow">System Status</h3>
            <div className="space-y-1">
              <div className="flex justify-between"><span>CPU_LOAD</span> <span className="text-cyber-success">42%</span></div>
              <div className="flex justify-between"><span>MEM_USE</span> <span className="text-cyber-success">1.2GB</span></div>
              <div className="flex justify-between"><span>NET_CONN</span> <span className="text-cyber-success">STABLE</span></div>
              <div className="flex justify-between"><span>CORE_TEMP</span> <span className="text-amber-400">45°C</span></div>
            </div>
          </div>

          <div className="cyber-box p-3 border-cyber-secondary/50">
            <h3 className="text-cyber-secondary mb-2">Bot Brain</h3>
            <div className="animate-pulse-fast text-cyber-secondary/80">
              [ANALYZING_PACKETS...]
              [UPDATING_MODELS...]
              [ENCRYPTING_PIPE...]
            </div>
          </div>

          <div className="flex-1" />

          <div className="text-cyber-muted italic">
            v2.4.0-STABLE
            <br />
            ID: CB-9981-22
          </div>
        </div>

        {/* Center: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-3 py-3 sm:px-6 sm:py-4 border-b border-cyber-border bg-cyber-bg/50 backdrop-blur-md flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-cyber-accent font-orbitron cyber-text-glow flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
                CYBER BOY
              </h1>
              <p className="text-[10px] sm:text-xs text-cyber-muted font-orbitron tracking-widest uppercase">
                Neural Security Interface
              </p>
            </div>
            <div className="hidden sm:block text-[10px] font-mono text-cyber-accent/50 animate-pulse">
              [CONNECTED_TO_DEEPSEEK_NODE]
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85vw] sm:max-w-[80%] relative group ${message.sender === "user" ? "" : ""
                    }`}
                >
                  {/* Sender Label */}
                  <div className={`text-[10px] font-orbitron uppercase mb-1 ${message.sender === "user" ? "text-right text-cyber-secondary" : "text-cyber-accent"
                    }`}>
                    {message.sender === "user" ? ":: Operator" : ":: Cyber_Boy"}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-sm px-3 py-2 sm:px-4 sm:py-3 border ${message.isError
                      ? "bg-red-950/40 border-red-500 text-red-200"
                      : message.sender === "user"
                        ? "bg-cyber-secondary/10 border-cyber-secondary/40 text-cyber-text"
                        : "bg-cyber-accent/5 border-cyber-accent/30 text-cyber-accent/90"
                      } ${message.sender !== 'user' && 'bot-message-glitch'}`}
                    style={{
                      clipPath: message.sender === 'user'
                        ? 'polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                        : 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
                    }}
                  >
                    <div className="text-xs sm:text-sm whitespace-pre-wrap font-cyber leading-relaxed">
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
                              className="font-bold text-cyber-accent text-lg mb-2 mt-3 first:mt-0 font-orbitron cyber-text-glow"
                            >
                              __{headerText}
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
                              className="font-bold text-cyber-accent text-lg mb-2 mt-3 first:mt-0 font-orbitron"
                            >
                              {"> "} {headerText}
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
                              className="font-bold text-cyber-accent text-base mb-1 mt-2 first:mt-0"
                            >
                              # {headerText}
                            </div>
                          );
                        }

                        return <div key={index}>{line || "\u00A0"}</div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-cyber-bg/80 backdrop-blur-xl border-t border-cyber-border p-3 sm:px-6 sm:py-6">
            <form onSubmit={handleSend} className="flex gap-2 sm:gap-4 max-w-5xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-accent/50 font-mono text-xs hidden sm:block">
                  $
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="EXECUTIVE_COMMAND_INPUT..."
                  className="w-full bg-cyber-bg border border-cyber-border text-cyber-accent placeholder-cyber-muted/50 rounded-sm px-4 py-3 sm:pl-8 sm:py-4 focus:outline-none focus:border-cyber-accent transition-colors font-cyber text-xs sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button min-w-[100px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyber-accent animate-ping" />
                    RUNNING
                  </span>
                ) : (
                  <span className="group-hover:animate-pulse">EXECUTE</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
