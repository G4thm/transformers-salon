"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu, X, CalendarDays,
  Home, Scissors, Tag, Images, BookOpen, Phone,
} from "lucide-react";

/* ─── nav items ─────────────────────────────────────────────── */
const NAV = [
  { href: "/",         label: "Home",    Icon: Home     },
  { href: "/services", label: "Services", Icon: Scissors },
  { href: "/offers",   label: "Offers",   Icon: Tag      },
  { href: "/gallery",  label: "Gallery",  Icon: Images   },
  { href: "/book",     label: "Book",     Icon: BookOpen },
  { href: "/contact",  label: "Contact",  Icon: Phone    },
];

/* ─── component ──────────────────────────────────────────────── */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  /* Lock body scroll — set on both <html> and <body> for iOS Safari */
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow  = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      html.style.overflow  = "";
      document.body.style.overflow = "";
    }
    return () => {
      html.style.overflow  = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ── Hamburger ──────────────────────────────────────────── */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          width:           "40px",
          height:          "40px",
          borderRadius:    "8px",
          background:      "transparent",
          border:          "none",
          cursor:          "pointer",
          color:           "inherit",
        }}
      >
        <Menu size={22} />
      </button>

      {/* ── Full-screen overlay — ALL critical CSS is inline ───── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{
          /* POSITIONING — never overridable by cascade */
          position:   "fixed",
          top:        0,
          left:       0,
          width:      "100vw",
          height:     "100vh",
          zIndex:     9999,

          /* SOLID BLACK BACKGROUND */
          backgroundColor: "#000000",

          /* SLIDE-IN FROM RIGHT */
          transform:  open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",

          /* LAYOUT */
          display:        "flex",
          flexDirection:  "column",
          overflowY:      "auto",
          overflowX:      "hidden",

          /* HIDE FROM A11Y TREE WHEN CLOSED */
          visibility:  open ? "visible" : "hidden",
        }}
      >

        {/* Orange top accent */}
        <div style={{
          position:   "absolute",
          top:        0,
          left:       0,
          right:      0,
          height:     "2px",
          background: "linear-gradient(90deg,transparent,#f97316 40%,transparent)",
          zIndex:     1,
        }} />

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "20px 24px",
          borderBottom:   "1px solid rgba(255,255,255,0.08)",
          flexShrink:     0,
        }}>
          <span style={{
            color:          "#ffffff",
            fontSize:       "1rem",
            fontWeight:     700,
            letterSpacing:  "0.08em",
            textTransform:  "uppercase",
          }}>
            Transformers Salon
          </span>

          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          "40px",
              height:         "40px",
              borderRadius:   "50%",
              background:     "rgba(255,255,255,0.08)",
              border:         "1px solid rgba(255,255,255,0.15)",
              color:          "#ffffff",
              cursor:         "pointer",
              flexShrink:     0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Nav links — vertically centered ───────────────── */}
        <nav style={{
          flex:           "1 1 auto",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          padding:        "8px 20px",
          gap:            "10px",
        }}>
          {NAV.map(({ href, label, Icon }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "16px",
                padding:        "16px 18px",
                borderRadius:   "16px",
                background:     "rgba(255,255,255,0.04)",
                border:         "1px solid rgba(255,255,255,0.06)",
                color:          "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize:       "1.05rem",
                fontWeight:     600,
                letterSpacing:  "0.01em",

                /* Staggered fade + slide */
                opacity:          open ? 1 : 0,
                transform:        open ? "translateX(0)" : "translateX(28px)",
                transition:       "opacity 0.3s ease, transform 0.3s ease",
                transitionDelay:  open ? `${100 + i * 55}ms` : "0ms",
              }}
            >
              {/* Icon pill */}
              <span style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          "42px",
                height:         "42px",
                borderRadius:   "12px",
                background:     "rgba(249,115,22,0.12)",
                border:         "1px solid rgba(249,115,22,0.2)",
                color:          "#f97316",
                flexShrink:     0,
              }}>
                <Icon size={18} />
              </span>

              {/* Label */}
              <span style={{ flex: 1 }}>{label}</span>

              {/* Arrow */}
              <span style={{
                color:    "rgba(255,255,255,0.2)",
                fontSize: "1.3rem",
                lineHeight: 1,
              }}>›</span>
            </Link>
          ))}
        </nav>

        {/* ── Book CTA ───────────────────────────────────────── */}
        <div style={{
          padding:      "20px 20px 36px",
          borderTop:    "1px solid rgba(255,255,255,0.08)",
          flexShrink:   0,
        }}>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "8px",
              width:          "100%",
              padding:        "15px 24px",
              borderRadius:   "999px",
              background:     "#f97316",
              color:          "#ffffff",
              fontWeight:     700,
              fontSize:       "1rem",
              textDecoration: "none",
              boxShadow:      "0 0 28px rgba(249,115,22,0.45)",
              letterSpacing:  "0.01em",
            }}
          >
            <CalendarDays size={18} />
            Book an Appointment
          </Link>

          <p style={{
            marginTop:     "14px",
            textAlign:     "center",
            fontSize:      "0.68rem",
            color:         "rgba(255,255,255,0.22)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Transformers Unisex Salon · Puducherry
          </p>
        </div>

      </div>
    </>
  );
}
