import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { tokens } from "../styles";
import { Icon } from "./Icon";

export interface CodeExample {
  language: "tsx" | "jsx" | "javascript";
  label: string;
  code: string;
  description?: string;
}

export interface HowToUseProps {
  title: string;
  description: string;
  examples: CodeExample[];
  children?: React.ReactNode;
}

export function HowToUse({
  title,
  description,
  examples,
  children,
}: HowToUseProps) {
  const [activeExample, setActiveExample] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: `linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.08))`,
          border: `1.5px solid rgba(96, 165, 250, 0.2)`,
          borderRadius: 14,
          color: tokens.text,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          marginBottom: 32,
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.4)";
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.12))`;
          e.currentTarget.style.transform = "translateX(4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.2)";
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.08))`;
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <span style={{ display: "grid", placeItems: "center", color: tokens.warning }}>
          <Icon name="bulb" size={18} />
        </span>
        <span style={{ flex: 1 }}>How to Use: {title}</span>
        <span style={{ marginLeft: "auto", transition: "transform 0.3s ease" }}>↓</span>
      </button>
    );
  }

  const current = examples[activeExample];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(167, 139, 250, 0.03))`,
        border: `1.5px solid rgba(96, 165, 250, 0.15)`,
        borderRadius: 16,
        padding: 28,
        marginBottom: 32,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        animation: "slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `1px solid rgba(96, 165, 250, 0.1)`,
        }}
      >
        <div style={{ animation: "fadeIn 0.5s ease 0.1s forwards", opacity: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: tokens.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ display: "grid", placeItems: "center", color: tokens.warning }}>
              <Icon name="bulb" size={18} />
            </span>
            {title}
          </h3>
          <p
            style={{ margin: "8px 0 0", fontSize: 13, color: tokens.textMuted }}
          >
            {description}
          </p>
        </div>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: `rgba(96, 165, 250, 0.08)`,
            border: "none",
            color: tokens.textMuted,
            fontSize: 20,
            cursor: "pointer",
            padding: 10,
            borderRadius: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(96, 165, 250, 0.15)`;
            e.currentTarget.style.color = tokens.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(96, 165, 250, 0.08)`;
            e.currentTarget.style.color = tokens.textMuted;
          }}
        >
          ✕
        </button>
      </div>

      {children && (
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: `1px solid rgba(96, 165, 250, 0.1)`,
            animation: "fadeIn 0.5s ease 0.15s forwards",
            opacity: 0,
          }}
        >
          {children}
        </div>
      )}

      {/* Example Tabs */}
      {examples.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
            animation: "fadeIn 0.5s ease 0.2s forwards",
            opacity: 0,
          }}
        >
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setActiveExample(i)}
              style={{
                padding: "8px 16px",
                background:
                  activeExample === i
                    ? `linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.2))`
                    : `rgba(96, 165, 250, 0.08)`,
                border: `1.5px solid ${
                  activeExample === i
                    ? "rgba(96, 165, 250, 0.4)"
                    : "rgba(96, 165, 250, 0.15)"
                }`,
                borderRadius: 10,
                color: activeExample === i ? tokens.text : tokens.textMuted,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (activeExample !== i) {
                  e.currentTarget.style.background = `rgba(96, 165, 250, 0.12)`;
                  e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeExample !== i) {
                  e.currentTarget.style.background = `rgba(96, 165, 250, 0.08)`;
                  e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.15)";
                }
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Description */}
      {current.description && (
        <p
          style={{
            fontSize: 13,
            color: tokens.textMuted,
            marginBottom: 16,
            animation: "fadeIn 0.5s ease 0.25s forwards",
            opacity: 0,
          }}
        >
          {current.description}
        </p>
      )}

      {/* Code Block */}
      <div
        style={{
          position: "relative",
          animation: "fadeIn 0.5s ease 0.3s forwards",
          opacity: 0,
        }}
      >
        <pre
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))`,
            border: `1px solid rgba(96, 165, 250, 0.15)`,
            borderRadius: 12,
            padding: 20,
            overflow: "auto",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--code-text)",
            fontFamily: "'JetBrains Mono', monospace",
            margin: 0,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.3)";
            e.currentTarget.style.background = `linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.15)";
            e.currentTarget.style.background = `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))`;
          }}
        >
          <code>{current.code}</code>
        </pre>
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <CopyButton
            text={current.code}
            label="Copy"
            variant="outline"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
