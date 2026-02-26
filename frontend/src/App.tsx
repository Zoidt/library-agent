import type { IntegrationMessage } from "@botpress/webchat";
import {
  Composer,
  Container,
  MessageList,
  StylesheetProvider,
  useWebchat,
} from "@botpress/webchat";
import * as React from "react";
import "./App.css";
import "./webchat.css";
import { BOT_CONFIG, CLIENT_ID } from "./config/constants";
import { useEnrichedMessages } from "./hooks/useEnrichedMessages";

const SUGGESTIONS = [
  "FIND_BOOK :: ancient rome",
  "QUERY :: must-read classics",
  "SCAN :: mystery novels",
  "LOOKUP :: haruki murakami",
];

// Pixel loading bar component
function PixelLoader() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.floor(Math.random() * 8) + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const blocks = Math.floor((progress / 100) * 20);

  return (
    <div className="loading-veil">
      <div className="pixel-boot">
        <div className="boot-logo">▣</div>
        <div className="boot-title">LIBR4RY.EXE</div>
        <div className="boot-line">INITIALIZING KNOWLEDGE BASE...</div>
        <div className="boot-bar">
          <span className="boot-bar-fill">
            {"█".repeat(blocks)}
            {"░".repeat(20 - blocks)}
          </span>
        </div>
        <div className="boot-percent">{Math.min(progress, 100)}%</div>
      </div>
    </div>
  );
}

function App() {
  const { client, messages, isTyping, user, clientState, newConversation } =
    useWebchat({ clientId: CLIENT_ID });

  const isLoading =
    clientState === "connecting" || clientState === "disconnected";
  const hasMessages = messages.length > 0;
  const enrichedMessages = useEnrichedMessages(messages, user?.userId);

  // Auto-focus composer on load
  React.useEffect(() => {
    const t = setTimeout(() => {
      (document.querySelector("textarea") as HTMLTextAreaElement | null)?.focus();
    }, 700);
    return () => clearTimeout(t);
  }, []);

  // Press "/" to focus composer
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        (document.querySelector("textarea") as HTMLTextAreaElement | null)?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const sendMessage = async (payload: IntegrationMessage["payload"]) => {
    if (!client) return;
    try {
      await client.sendMessage(payload);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const chatClass = isLoading
    ? "is-loading"
    : hasMessages
      ? "has-messages"
      : "empty-state";

  return (
    <div className="app-shell">
      {/* Background layers */}
      <div className="bg-void"     aria-hidden />
      <div className="bg-grid"     aria-hidden />
      <div className="bg-glow"     aria-hidden />
      <div className="bg-scanlines" aria-hidden />

      <div className={`chat-wrapper ${chatClass}`}>
        <Container
          connected={clientState !== "disconnected"}
          style={{ width: "100%", height: "100%", display: "flex" }}
        >
          {/* New session button */}
          <button
            className="new-chat-btn"
            onClick={() => {
              newConversation();
              setTimeout(() => {
                (document.querySelector("textarea") as HTMLTextAreaElement | null)?.focus();
              }, 150);
            }}
          >
            [ + NEW SESSION ]
          </button>

          {/* Pixel boot loader */}
          {isLoading && <PixelLoader />}

          {/* Empty state hero */}
          <div className="hero">
            <div className="hero-badge">◈ NEURAL ARCHIVE SYSTEM ◈</div>
            <h1 className="hero-title" data-text="LIBR4RY.EXE">
              LIBR4RY.EXE
            </h1>
            <div className="hero-divider">
              ──────────────────────────────
            </div>
            <p className="hero-status">
              <span className="status-dot" aria-hidden="true">●</span>
              {" KNOWLEDGE_BASE :: ONLINE"}
            </p>
            <p className="hero-sub">
              {"> QUERY ANYTHING. FIND EVERYTHING."}
            </p>
          </div>

          {/* Suggestion menu */}
          <div className="suggestions">
            {SUGGESTIONS.map((text, i) => (
              <button
                key={text}
                className="suggestion-item"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => sendMessage({ type: "text", text })}
              >
                <span className="suggestion-arrow" aria-hidden="true">►</span>
                {text}
              </button>
            ))}
          </div>

          <MessageList
            botName={BOT_CONFIG.name}
            botDescription={BOT_CONFIG.description}
            isTyping={isTyping}
            showMessageStatus={false}
            showMarquee={false}
            messages={enrichedMessages}
            sendMessage={sendMessage}
          />

          <Composer
            disableComposer={false}
            isReadOnly={false}
            allowFileUpload={false}
            connected={clientState !== "disconnected"}
            sendMessage={sendMessage}
            composerPlaceholder="ENTER QUERY..."
          />
        </Container>

        <p className="page-footer">
          <span className="footer-bracket">[</span>
          {" BOTPRESS ADK "}
          <span className="footer-bracket">]</span>
          {" v2.0"}
        </p>
      </div>

      <StylesheetProvider
        radius={0}
        fontFamily="Share Tech Mono"
        variant="solid"
        color="#00d4ff"
      />
    </div>
  );
}

export default App;
