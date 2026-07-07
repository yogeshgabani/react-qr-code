import { useState, useEffect, type CSSProperties } from "react";
import { TypesTab } from "./tabs/TypesTab";
import { DesignTab } from "./tabs/DesignTab";
import { ThemesTab } from "./tabs/ThemesTab";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { StudioTab } from "./tabs/StudioTab";
import { ScannerTab } from "./tabs/ScannerTab";
import { BatchTab } from "./tabs/BatchTab";
import { DynamicTab } from "./tabs/DynamicTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import {
  GettingStarted,
  QRCodeModal,
  SocialIcons,
  LiveStats,
  Icon,
  ThemeToggle,
} from "./components";
import { tokens, pill } from "./styles";
import { QRModalContext } from "./QRModalContext";
import type { QRCodeProps } from "react-qr-master";

type TabId =
  | "types"
  | "design"
  | "themes"
  | "templates"
  | "studio"
  | "scanner"
  | "batch"
  | "dynamic"
  | "analytics";

interface TabDef {
  id: TabId;
  label: string;
  group: string;
  icon: string;
  description: string;
  Component: () => JSX.Element;
}

const TABS: TabDef[] = [
  {
    id: "types",
    label: "QR Types",
    group: "Showcase",
    icon: "⚡",
    description: "16 ready-to-use QR payload wrappers",
    Component: TypesTab,
  },
  {
    id: "design",
    label: "Design Engine",
    group: "Showcase",
    icon: "🎨",
    description: "Module shapes, eye styles, gradients, animations",
    Component: DesignTab,
  },
  {
    id: "themes",
    label: "Themes",
    group: "Showcase",
    icon: "✨",
    description: "10 hand-tuned presets â€” one prop applies the whole look",
    Component: ThemesTab,
  },
  {
    id: "templates",
    label: "Templates",
    group: "Showcase",
    icon: "🗂️",
    description: "Industry-specific presets across 11 categories",
    Component: TemplatesTab,
  },
  {
    id: "studio",
    label: "Studio",
    group: "Apps",
    icon: "🛠️",
    description: "Visual editor â€” every knob on one screen",
    Component: StudioTab,
  },
  {
    id: "scanner",
    label: "Scanner",
    group: "Apps",
    icon: "📷",
    description: "Live camera scanning with jsQR",
    Component: ScannerTab,
  },
  {
    id: "batch",
    label: "Batch",
    group: "Apps",
    icon: "📦",
    description: "CSV / JSON â†’ ZIP or PDF",
    Component: BatchTab,
  },
  {
    id: "dynamic",
    label: "Dynamic",
    group: "Apps",
    icon: "🔄",
    description: "Swap destinations, expire, throttle",
    Component: DynamicTab,
  },
  {
    id: "analytics",
    label: "Analytics",
    group: "Apps",
    icon: "📊",
    description: "Client-side scan tracking and breakdowns",
    Component: AnalyticsTab,
  },
];

const STATS = [
  { value: "16", label: "QR types" },
  { value: "8", label: "Module shapes" },
  { value: "5", label: "Eye styles" },
  { value: "3", label: "Gradients" },
  { value: "9", label: "Animations" },
  { value: "10", label: "Themes" },
  { value: "18", label: "Templates" },
];

const sidebarBtn = (active: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid transparent",
  background: active
    ? "linear-gradient(135deg,rgba(168,85,247,0.18),rgba(124,58,237,0.06))"
    : "transparent",
  borderColor: active ? "rgba(168,85,247,0.35)" : "transparent",
  color: active ? tokens.text : tokens.textMuted,
  cursor: "pointer",
  fontSize: 13.5,
  fontWeight: active ? 600 : 500,
  width: "100%",
  textAlign: "left",
  transition: "all 0.15s ease",
  position: "relative",
});

const groupLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: tokens.textSubtle,
  textTransform: "uppercase",
  letterSpacing: 1.4,
  padding: "14px 12px 6px",
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
};

/** Track a max-width breakpoint with a resize listener (inline styles can't use media queries). */
function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile(900);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [active, setActive] = useState<TabId>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    return (
      (TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : "types") ||
      "types"
    );
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<Partial<QRCodeProps>>({
    value: "https://example.com",
  });
  const [modalTitle, setModalTitle] = useState("QR Code Designer");

  const openQRModal = (
    props: Partial<QRCodeProps>,
    title = "QR Code Designer",
  ) => {
    setModalProps(props);
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeQRModal = () => {
    setModalOpen(false);
  };

  const current = TABS.find((t) => t.id === active) ?? TABS[0]!;
  const Tab = current.Component;

  // Sync active tab to URL and scroll to top
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (active === "types") {
      params.delete("tab");
    } else {
      params.set("tab", active);
    }
    const newUrl =
      params.toString() === ""
        ? window.location.pathname
        : `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    // Scroll to top smoothly when tab changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active]);

  const groups = Array.from(new Set(TABS.map((t) => t.group)));

  // Close the mobile drawer whenever we grow to desktop width.
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (isMobile && drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, drawerOpen]);

  // Handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <QRModalContext.Provider value={{ openQRModal, closeQRModal }}>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: isMobile ? "block" : "grid",
          gridTemplateColumns: isMobile ? undefined : "260px minmax(0, 1fr)",
          gap: 0,
        }}
      >
        {/* â”€â”€ Mobile top bar (hamburger) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {isMobile && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: `1px solid ${tokens.border}`,
              background: "var(--bar-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#a855f7 0%,#22d3ee 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Icon name="brand" size={18} />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  background: "var(--brand-text-grad)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                react-qr-master
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ThemeToggle size={40} />
              <button
                aria-label="Open navigation menu"
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: `1px solid ${tokens.border}`,
                  background: tokens.bgCard,
                  color: tokens.text,
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ☰
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€ Drawer backdrop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {isMobile && drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 45,
            }}
          />
        )}

        {/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <aside
          style={{
            padding: "24px 16px",
            borderRight: `1px solid ${tokens.border}`,
            background: isMobile
              ? "var(--sidebar-bg-solid)"
              : "var(--sidebar-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            position: isMobile ? "fixed" : "sticky",
            top: 0,
            left: 0,
            width: isMobile ? 280 : "auto",
            maxWidth: "85vw",
            height: "100vh",
            zIndex: 50,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            transform: isMobile
              ? drawerOpen
                ? "translateX(0)"
                : "translateX(-100%)"
              : "none",
            transition: "transform 0.25s ease",
          }}
        >
          {isMobile && (
            <button
              aria-label="Close navigation menu"
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${tokens.border}`,
                background: "rgba(255,255,255,0.04)",
                color: tokens.text,
                cursor: "pointer",
                fontSize: 16,
                zIndex: 2,
              }}
            >
              ✕
            </button>
          )}
          <div
            style={{
              padding: "16px 12px",
              borderBottom: `1px solid ${tokens.border}`,
              marginBottom: 16,
              marginLeft: -8,
              marginRight: -8,
              marginTop: -16,
              background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(34,211,238,0.04) 100%)`,
              borderTop: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: -0.3,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#a855f7 0%,#22d3ee 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  boxShadow:
                    "0 8px 24px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  flexShrink: 0,
                }}
              >
                <Icon name="brand" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    background: "var(--brand-text-grad)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontSize: 16,
                    fontWeight: 900,
                    margin: 0,
                  }}
                >
                  react-qr-master
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 10,
                    color: tokens.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  v0.1.0 • playground
                </div>
              </div>
            </div>
          </div>

          {groups.map((group) => (
            <div key={group}>
              <div style={groupLabel}>{group}</div>
              {TABS.filter((t) => t.group === group).map((t) => (
                <button
                  key={t.id}
                  style={sidebarBtn(t.id === active)}
                  onClick={() => {
                    setActive(t.id);
                    setDrawerOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    if (t.id !== active)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (t.id !== active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon name={t.id} size={18} />
                  </span>
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.id === active ? (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: tokens.primary,
                        boxShadow: `0 0 8px ${tokens.primary}`,
                      }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ marginBottom: 12 }}>
            <ThemeToggle wide />
          </div>
          <div
            style={{
              padding: 12,
              background: tokens.bgCard,
              border: `1px solid ${tokens.border}`,
              borderRadius: 10,
              fontSize: 11,
              color: tokens.textMuted,
              lineHeight: 1.5,
            }}
          >
            Edit anything under{" "}
            <code style={{ color: tokens.accent }}>src/</code> or{" "}
            <code style={{ color: tokens.accent }}>playground/src/</code> â€”
            Vite HMR refreshes instantly.
          </div>
        </aside>

        {/* â”€â”€ Main content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <main style={{ padding: "0", minWidth: 0 }}>
          {/* Hero / header strip */}
          <header
            style={{
              padding: isMobile ? "36px 20px 28px" : "64px 48px 48px",
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(34,211,238,0.04) 50%, rgba(168,85,247,0.04) 100%)`,
              borderBottom: `1px solid ${tokens.border}`,
            }}
          >
            {/* Gradient orb backgrounds */}
            <div
              style={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 400,
                height: 400,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -50,
                left: 100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    ...pill,
                    color: tokens.accent,
                    borderColor: "rgba(34,211,238,0.5)",
                    background: "rgba(34,211,238,0.15)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: tokens.accent,
                      boxShadow: `0 0 8px ${tokens.accent}`,
                    }}
                  />
                  LIVE PREVIEW
                </span>
                <span
                  style={{
                    ...pill,
                    background: "rgba(168,85,247,0.15)",
                    borderColor: "rgba(168,85,247,0.4)",
                    color: "#c4b5fd",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {current.group.toUpperCase()}
                </span>
              </div>
              <h1
                style={{
                  fontSize: isMobile ? 32 : 56,
                  margin: 0,
                  fontWeight: 900,
                  letterSpacing: isMobile ? -0.8 : -1.5,
                  lineHeight: 1.05,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 10 : 16,
                  flexWrap: "wrap",
                  background: "var(--hero-text-grad)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: isMobile ? 48 : 68,
                    height: isMobile ? 48 : 68,
                    borderRadius: isMobile ? 14 : 18,
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    background:
                      "linear-gradient(135deg,#a855f7 0%,#7c3aed 55%,#22d3ee 100%)",
                    boxShadow:
                      "0 10px 30px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                    WebkitTextFillColor: "#fff",
                  }}
                >
                  <Icon name={current.id} size={isMobile ? 26 : 36} strokeWidth={2.2} />
                </span>
                {current.label}
              </h1>
              <p
                style={{
                  fontSize: isMobile ? 14.5 : 16,
                  color: tokens.textMuted,
                  margin: isMobile ? "0 0 24px 0" : "0 0 32px 0",
                  maxWidth: 700,
                  lineHeight: 1.6,
                }}
              >
                {current.description}
              </p>

              {active === "types" ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "repeat(auto-fit, minmax(100px, 1fr))"
                      : "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: isMobile ? 8 : 12,
                    maxWidth: 900,
                  }}
                >
                  {STATS.map((s, i) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        padding: "16px 16px",
                        background: `linear-gradient(135deg, rgba(168,85,247,${0.08 + i * 0.02}) 0%, rgba(34,211,238,${0.04 + i * 0.01}) 100%)`,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: 14,
                        transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, rgba(168,85,247,${0.15 + i * 0.02}) 0%, rgba(34,211,238,${0.1 + i * 0.01}) 100%)`;
                        e.currentTarget.style.borderColor =
                          "rgba(168,85,247,0.5)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(168,85,247,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, rgba(168,85,247,${0.08 + i * 0.02}) 0%, rgba(34,211,238,${0.04 + i * 0.01}) 100%)`;
                        e.currentTarget.style.borderColor = tokens.border;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 900,
                          background: "linear-gradient(135deg,#a855f7,#22d3ee)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                          letterSpacing: -0.5,
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: tokens.textMuted,
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </header>

          <div
            style={{ padding: isMobile ? "16px 16px 56px" : "24px 24px 80px" }}
          >
            {active === "types" && <GettingStarted />}
            <Tab />
          </div>

          {/* Footer */}
          <footer
            style={{
              marginTop: isMobile ? 48 : 96,
              marginBottom: 24,
              padding: isMobile ? "0 16px 40px" : "48px 48px 80px",
            }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: isMobile ? 16 : 20,
                padding: 1,
                background:
                  "linear-gradient(135deg, rgba(244,114,182,0.55) 0%, rgba(167,139,250,0.15) 40%, rgba(56,189,248,0.55) 100%)",
              }}
            >
              <div
                style={{
                  borderRadius: isMobile ? 15 : 19,
                  background:
                    "linear-gradient(180deg, rgb(var(--surface-strong-rgb) / 0.85) 0%, rgb(var(--surface-strong-rgb) / 0.95) 100%)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  padding: isMobile ? "clamp(16px, 5vw, 28px)" : "28px 20px",
                }}
              >
                {/* Top row: brand + action buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 20,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 30,
                        borderRadius: 10,
                        background: "rgba(167,139,250,0.12)",
                        border: "1px solid rgba(167,139,250,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        padding: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#a78bfa",
                        }}
                      />
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#f472b6",
                        }}
                      />
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#38bdf8",
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: isMobile ? 14 : 16,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        react-qr-master
                      </div>
                      <div
                        style={{
                          color: "var(--text-muted)",
                          fontSize: isMobile ? 11 : 13,
                          marginTop: 2,
                        }}
                      >
                        Modern, accessible qr code generator component for React
                        & Next.js
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 6 : 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href="https://github.com/yogeshgabani/react-next-select"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: isMobile ? 4 : 8,
                        padding: isMobile ? "6px 12px" : "9px 16px",
                        borderRadius: 999,
                        border: "1px solid rgb(var(--border-rgb) / 0.18)",
                        background: "rgb(var(--surface-rgb) / 0.04)",
                        color: "var(--text-primary)",
                        fontSize: isMobile ? 11 : 13,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.65 18.35.5 12 .5Z" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href="https://www.npmjs.com/package/react-next-select"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        borderRadius: 999,
                        border: "1px solid rgb(var(--border-rgb) / 0.18)",
                        background: "rgb(var(--surface-rgb) / 0.04)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <svg
                        width="22"
                        height="14"
                        viewBox="0 0 27 16"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M0 0h27v14H14v2H7v-2H0V0Zm2 12h5V4h3v8h2V2H2v10Zm12-10v12h5v-2h5V2H14Zm8 2h-3v6h3V4Z" />
                      </svg>
                      npm
                    </a>
                    <a
                      href="#demos"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        borderRadius: 999,
                        border: "1px solid rgb(var(--border-rgb) / 0.18)",
                        background: "rgb(var(--surface-rgb) / 0.04)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <rect x="3" y="4" width="18" height="14" rx="2" />
                        <path d="M3 8h18" />
                      </svg>
                      Demos
                    </a>
                  </div>
                </div>

                {/* Social card â€” horizontal profile row, wraps on small screens */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 18,
                    padding: "18px 0px",
                    marginBottom: 20,
                    borderRadius: 16,
                    border: "1px solid rgb(var(--border-rgb) / 0.12)",
                    background:
                      "radial-gradient(120% 140% at 0% 50%, rgba(168, 85, 247, 0.14), transparent 55%), radial-gradient(120% 140% at 100% 50%, rgba(56, 189, 248, 0.10), transparent 55%), rgb(var(--surface-rgb) / 0.03)",
                    overflow: "hidden",
                  }}
                >
                  {/* Top gradient hairline */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "10%",
                      right: "10%",
                      height: 2,
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, transparent, #a855f7, #ec4899, #38bdf8, transparent)",
                      opacity: 0.7,
                    }}
                  />

                  {/* Left: avatar + text â€” kept together so they wrap as a unit */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 10 : 14,
                      minWidth: 0,
                      flex: "1 1 auto",
                    }}
                  >
                    {/* Avatar-style monogram */}
                    <div
                      aria-hidden
                      style={{
                        flex: "0 0 auto",
                        width: isMobile ? 40 : 46,
                        height: isMobile ? 40 : 46,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? 14 : 17,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #a855f7 0%, #ec4899 55%, #38bdf8 100%)",
                        boxShadow:
                          "0 8px 24px rgba(168, 85, 247, 0.35), 0 0 0 4px rgba(168, 85, 247, 0.12)",
                      }}
                    >
                      YG
                    </div>

                    {/* Heading + subtitle */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          letterSpacing: -0.2,
                          background:
                            "linear-gradient(135deg, #a855f7, #ec4899 55%, #38bdf8)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Connect with Yogesh
                      </span>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 400,
                          color: "var(--text-muted, #64748b)",
                        }}
                      >
                        Follow for updates, releases &amp; new components
                      </span>
                    </div>
                  </div>

                  {/* Right: social icons */}
                  <SocialIcons size={38} />

                  {/* Bottom gradient hairline */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "10%",
                      right: "10%",
                      height: 2,
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, transparent, #a855f7, #ec4899, #38bdf8, transparent)",
                      opacity: 0.7,
                    }}
                  />
                </div>

                {/* Bottom row: license + credit */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 9px",
                          borderRadius: 6,
                          border: "1px solid rgba(167,139,250,0.35)",
                          background: "rgba(167,139,250,0.10)",
                          color: "#c4b5fd",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        MIT
                      </span>
                      <span
                        style={{ color: "var(--text-muted)", fontSize: 13 }}
                      >
                        · © 2026 react-qr-master
                      </span>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      Crafted with <span style={{ color: "#f472b6" }}>♥</span>{" "}
                      for the React & Next.js community
                    </div>
                  </div>

                  <a
                    href="https://github.com/yogeshgabani"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 16px",
                      borderRadius: 999,
                      border: "1px solid rgb(var(--border-rgb) / 0.18)",
                      background: "rgb(var(--surface-rgb) / 0.04)",
                      color: "var(--text-muted)",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Built by{" "}
                    <span
                      style={{
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      Yogesh Gabani
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* Live site stats */}
          <div style={{ padding: isMobile ? "15px 16px" : "30px 16px" }}>
            <LiveStats />
          </div>
        </main>

        {/* Scroll-to-Top Button with Smooth Animation */}
        <style>{`
          @keyframes slideUpFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideDownFadeOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(20px);
            }
          }
          .scroll-to-top-visible {
            animation: slideUpFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .scroll-to-top-hidden {
            animation: slideDownFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        <button
          onClick={scrollToTop}
          className={`${showScrollTop ? "scroll-to-top-visible" : "scroll-to-top-hidden"}`}
          style={{
            position: "fixed",
            bottom: isMobile ? 20 : 32,
            right: isMobile ? 16 : 32,
            width: isMobile ? 44 : 52,
            height: isMobile ? 44 : 52,
            padding: 0,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
            color: "white",
            fontSize: isMobile ? 18 : 20,
            fontWeight: 700,
            cursor: "pointer",
            display: showScrollTop ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 8px 32px rgba(96, 165, 250, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(10px)",
            zIndex: 45,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 12px 48px rgba(96, 165, 250, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(96, 165, 250, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)";
          }}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          ↑
        </button>

        <QRCodeModal
          isOpen={modalOpen}
          onClose={closeQRModal}
          initialProps={modalProps}
          title={modalTitle}
        />
      </div>
    </QRModalContext.Provider>
  );
}
