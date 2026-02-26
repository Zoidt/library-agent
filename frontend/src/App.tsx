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
  "Find me a book about ancient Rome",
  "What are some must-read classics?",
  "Recommend a mystery novel",
  "Help me find books by Haruki Murakami",
];

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

  // Press "/" anywhere to focus the composer
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
      {/* Atmospheric background layers */}
      <div className="bg-atmosphere" aria-hidden />
      <div className="bg-grain" aria-hidden />
      <div className="bg-spine" aria-hidden />

      <div className={`chat-wrapper ${chatClass}`}>
        <Container
          connected={clientState !== "disconnected"}
          style={{ width: "100%", height: "100%", display: "flex" }}
        >
          {/* New conversation button */}
          <button
            className="new-chat-btn"
            onClick={() => {
              newConversation();
              setTimeout(() => {
                (document.querySelector("textarea") as HTMLTextAreaElement | null)?.focus();
              }, 150);
            }}
            title="Start new conversation"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New
          </button>

          {/* Loading — candlelight */}
          {isLoading && (
            <div className="loading-veil">
              <div className="candle-wrap">
                <div className="candle-flame" />
                <div className="candle-halo" />
              </div>
            </div>
          )}

          {/* Empty state hero */}
          <div className="hero">
            <span className="hero-ornament" aria-hidden="true">
              ❦
            </span>
            <h1 className="hero-title">Alexandria</h1>
            <div className="hero-rule" aria-hidden="true">
              <span />
              <span className="hero-rule-dot">✦</span>
              <span />
            </div>
            <p className="hero-tagline">{BOT_CONFIG.description}</p>
          </div>

          {/* Suggestion prompts */}
          <div className="suggestions">
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                className="suggestion-pill"
                onClick={() => sendMessage({ type: "text", text })}
              >
                <span className="suggestion-chevron" aria-hidden="true">
                  ›
                </span>
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
            composerPlaceholder="Ask about books, authors, or recommendations…"
          />
        </Container>

        <p className="page-footer">Powered by Botpress ADK</p>
      </div>

      <StylesheetProvider
        radius={0.25}
        fontFamily="EB Garamond"
        variant="solid"
        color="#c8962e"
      />
    </div>
  );
}

export default App;
