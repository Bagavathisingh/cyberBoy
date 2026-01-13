import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Cpu,
  User,
  Shield,
  Terminal,
  PlusCircle,
  Sparkles
} from "lucide-react";
import { addMessage } from "../utils/chatbotData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the Radiant Interface. I am your neural assistant. How can I facilitate your protocol today?",
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

    try {
      const sessionResult = await addMessage(userMessage, sessionId);
      if (!sessionId && sessionResult && sessionResult._id) {
        setSessionId(sessionResult._id);
        localStorage.setItem("cyberboy_session_id", sessionResult._id);
      }
    } catch (e) { console.error("Session sync failed", e); }

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey || apiKey === "free" || !apiKey.startsWith("sk-")) {
        throw new Error("Neural Link Required. Please check your API configuration.");
      }

      const apiMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      apiMessages.push({
        role: "user",
        content: userInput,
      });

      const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Radiant Assistant",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant named Radiant Neural Assistant. Be concise and professional. Use markdown for structure (lists, tables, bold, headers). Your aesthetic is high-end gaming, inspired by Zentry.",
            },
            ...apiMessages,
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`Link Error: ${response.status}`);

      const data = await response.json();
      let botResponse = data.choices[0]?.message?.content || "The link was interrupted.";

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
          try { addMessage(botMessage, sessionId); } catch (e) { }
        }
      }, 5); // Faster typing
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setMessages((prev) => [...prev, { id: Date.now(), text: "NEURAL_ERROR: " + err.message, sender: "bot" }]);
    }
  };

  return (
    <div className="flex h-screen bg-cyber-bg text-cyber-text font-cyber overflow-hidden pt-20">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyber-accent/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyber-secondary/5 blur-[200px] rounded-full" />
      </div>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 h-full p-6 hidden lg:flex flex-col gap-6 relative z-10"
      >
        <div className="bento-card h-full p-8 border-cyber-border bg-cyber-panel flex flex-col">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <div className="w-10 h-10 bg-cyber-accent rounded-xl flex items-center justify-center rotate-6 shrink-0 shadow-[0_0_20px_rgba(237,255,102,0.3)]">
              <Cpu className="text-black w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-zentry uppercase tracking-tight italic leading-none mb-1">Neural</h2>
              <p className="text-[10px] font-bold text-cyber-muted uppercase tracking-widest">Interface v2.4</p>
            </div>
          </div>

          <button
            className="w-full p-4 rounded-2xl bg-white/[0.03] border border-cyber-border hover:border-cyber-accent/50 hover:bg-white/[0.05] transition-all flex items-center gap-4 group mb-8"
          >
            <PlusCircle className="w-5 h-5 text-cyber-accent group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Clear Uplink</span>
          </button>

          <div className="space-y-4">
            <div className="bento-card p-6 bg-white/[0.02] border-cyber-border">
              <p className="text-[9px] font-black text-cyber-muted uppercase tracking-[0.2em] mb-4">Node Metrics</p>
              <div className="space-y-3 font-black text-[10px] uppercase tracking-widest">
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Latency</span>
                  <span className="text-cyber-accent">14MS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Sync</span>
                  <span className="text-cyber-success">Linked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="mt-6 pt-6 border-t border-cyber-border flex items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-700">
            <Shield className="w-5 h-5 text-cyber-accent" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">Secure Neural <br /> Protocol Active</p>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 h-full relative flex flex-col z-10">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 pb-52 custom-scrollbar">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="zentry-title opacity-10 mb-8 pointer-events-none select-none">RADIANT</div>
              <p className="text-cyber-muted text-xs font-bold tracking-[0.4em] uppercase mb-12">Neural link ready for transmission</p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-4`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-xl bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={16} className="text-cyber-accent" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-3xl w-fit px-8 py-6 rounded-[2rem] border transition-all ${msg.sender === "user"
                    ? "bg-white/5 border-cyber-border rounded-br-lg"
                    : "bg-white/[0.02] border-cyber-border rounded-bl-lg backdrop-blur-3xl shadow-2xl"
                  }`}>
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyber-muted">
                      {msg.sender === "user" ? "Identity: Operator" : "Identity: Neural Core"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base leading-relaxed font-medium markdown-content text-cyber-text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-cyber-border flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-cyber-muted" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-cyber-accent/5 flex items-center justify-center">
                <Terminal size={14} className="text-cyber-accent/40 animate-pulse" />
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
          <form onSubmit={handleSend} className="relative bento-card p-0.5 shadow-2xl bg-cyber-panel backdrop-blur-xl">
            <input
              type="text"
              placeholder="TRANSMIT_NEURAL_COMMAND..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent rounded-[1.5rem] px-6 py-2.5 text-xs font-bold placeholder:text-cyber-text/20 focus:outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyber-accent rounded-xl flex items-center justify-center group active:scale-90 transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(237,255,102,0.1)]"
            >
              <Send className="text-black w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
          <p className="mt-2 text-[6px] font-black text-cyber-muted text-center uppercase tracking-[0.5em] opacity-20">
            Neural link encrypted via Radiant Protocol // v2.4.0
          </p>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
