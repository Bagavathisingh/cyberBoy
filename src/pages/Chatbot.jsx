import { useState, useRef, useEffect } from "react";
import { addMessage } from "../utils/chatbotData";
import Loader from "../components/Loader";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Cyber Bot, your cybersecurity assistant. How can I help you today?",
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
          "OpenRouter API key required. Get a FREE API key."
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

      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
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
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a helpful cybersecurity assistant named Cyber Bot. Provide clear, accurate responses. Use [H1]Text[/H1] for headers.",
            },
            ...apiMessages,
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      let botResponse = data.choices[0]?.message?.content || "No response.";

      botResponse = botResponse
        .replace(/^#\s+(.+)$/gm, (m, h) => `[H1]${h.trim()}[/H1]`)
        .replace(/^##\s+(.+)$/gm, (m, h) => `[H2]${h.trim()}[/H2]`);

      setIsLoading(false);

      const botMessageId = Date.now() + 1;
      const botMessage = { id: botMessageId, text: botResponse, sender: "bot" };
      setMessages((prev) => [...prev, { ...botMessage, text: "" }]);

      let currentIndex = 0;
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < botResponse.length) {
          const currentText = botResponse.substring(0, currentIndex + 1);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: currentText } : msg))
          );
          currentIndex++;
          scrollToBottom();
        } else {
          clearInterval(typingIntervalRef.current);
          addMessage(botMessage, sessionId);
        }
      }, 15);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-73px)] bg-cyber-bg overflow-hidden text-cyber-text">
      {/* Background Decor */}
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Terminal Info (Sidebar) */}
        <div className="hidden xl:flex flex-col w-64 border-r border-cyber-border bg-cyber-panel/30 backdrop-blur-md p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-accent shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-cyber-accent">CORE_STATUS</span>
            </div>
            <div className="space-y-2 font-mono text-[10px] text-cyber-muted">
              <div className="flex justify-between border-b border-cyber-border/50 pb-1"><span>LINK</span> <span className="text-cyber-success">STABLE</span></div>
              <div className="flex justify-between border-b border-cyber-border/50 pb-1"><span>NODE</span> <span className="text-cyber-text">AP-SO-1</span></div>
              <div className="flex justify-between"><span>ENCR</span> <span className="text-cyber-text">AES-256</span></div>
            </div>
          </div>

          <div className="cyber-box p-4 bg-cyber-accent/5 border-cyber-accent/20">
            <div className="text-[9px] font-orbitron text-cyber-muted mb-2 font-black">NEURAL_LOAD</div>
            <div className="h-1 bg-cyber-border/30 rounded-full overflow-hidden">
              <div className="h-full bg-cyber-accent w-3/4 animate-pulse-subtle" />
            </div>
          </div>

          <div className="flex-1" />

          <div className="opacity-30 flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 border border-cyber-muted rotate-45 group-hover:bg-cyber-accent group-hover:border-cyber-accent transition-colors" />
            <span className="text-[8px] font-mono tracking-tighter">Cyber_Boy_V5.0</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-cyber-bg/50">
          {/* Header */}
          <div className="px-6 py-5 border-b border-cyber-border flex items-center justify-between bg-cyber-panel/50 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center border border-cyber-accent/30 bg-cyber-accent/5 rotate-45">
                <div className="w-3 h-3 bg-cyber-accent/20 -rotate-45" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-orbitron tracking-tighter text-cyber-text">
                  CYBER_<span className="text-cyber-accent">BOT</span>
                </h1>
                <p className="text-[9px] font-mono text-cyber-muted tracking-[0.4em] uppercase">Intelligence_Interface</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-cyber-muted hidden sm:block font-bold">
              [ SECURE_SESSION_ACTIVE ]
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85vw] sm:max-w-[70%] group">
                  {/* Meta */}
                  <div className={`flex items-center gap-3 mb-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <span className={`text-[10px] font-orbitron font-black tracking-widest ${message.sender === "user" ? "text-cyber-muted" : "text-cyber-accent"}`}>
                      {message.sender === "user" ? "IDENT_USER" : "IDENT_SYSTEM"}
                    </span>
                    <div className={`h-px w-4 ${message.sender === "user" ? "bg-cyber-border" : "bg-cyber-accent/30"}`} />
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 sm:p-6 border transition-all duration-500 rounded-sm ${message.isError
                      ? "bg-red-500/5 border-red-500/30 text-red-600"
                      : message.sender === "user"
                        ? "bg-cyber-panel border-cyber-border hover:border-cyber-muted text-cyber-text shadow-sm"
                        : "bg-cyber-accent/[0.03] border-cyber-accent/20 hover:border-cyber-accent/40 text-cyber-text"
                    }`}>
                    <div className="text-xs sm:text-sm font-cyber leading-relaxed">
                      {message.text.split("\n").map((line, index) => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith("[H1]") && trimmedLine.endsWith("[/H1]")) {
                          return <div key={index} className="text-cyber-accent text-base font-bold mb-4 mt-2 font-orbitron border-l-2 border-cyber-accent/30 pl-3">{trimmedLine.slice(4, -5)}</div>;
                        }
                        if (trimmedLine.startsWith("[H2]") && trimmedLine.endsWith("[/H2]")) {
                          return <div key={index} className="text-cyber-text font-bold mb-3 mt-4 first:mt-0 opacity-80">{trimmedLine.slice(4, -5)}</div>;
                        }
                        return <div key={index} className="mb-1">{line || "\u00A0"}</div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[85vw] sm:max-w-[70%]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-orbitron font-black tracking-widest text-cyber-accent">IDENT_SYSTEM</span>
                    <div className="h-px w-4 bg-cyber-accent/30" />
                  </div>
                  <div className="p-4 sm:p-6 border border-cyber-accent/20 bg-cyber-accent/[0.02]">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-cyber-accent/60">
                      <div className="flex gap-1.5">
                        <div className="w-1 h-3 bg-cyber-accent/40 animate-pulse" />
                        <div className="w-1 h-3 bg-cyber-accent/40 animate-pulse [animation-delay:0.2s]" />
                        <div className="w-1 h-3 bg-cyber-accent/40 animate-pulse [animation-delay:0.4s]" />
                      </div>
                      SYNCHRONIZING_BUFFER...
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interface Inputs */}
          <div className="p-6 border-t border-cyber-border bg-cyber-panel/80 backdrop-blur-2xl">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative group bg-cyber-bg border border-cyber-border hover:border-cyber-accent transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-cyber-accent text-[10px] opacity-70">$</div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="EXECUTIVE_COMMAND_INPUT..."
                  className="w-full bg-transparent px-8 py-4 focus:outline-none text-xs sm:text-sm font-cyber placeholder-cyber-muted/30 text-cyber-text"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button min-w-[140px] disabled:opacity-20 transition-all font-bold"
              >
                {isLoading ? "SYNCING" : "EXECUTE"}
              </button>
            </form>
            <div className="max-w-4xl mx-auto mt-3 flex justify-between text-[8px] font-mono text-cyber-accent/50 uppercase tracking-[0.3em] font-bold">
              <span>Latency: 12ms</span>
              <span>Enc: v5.0_Secure</span>
              <span>Loc: Node_AP_SO_1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
