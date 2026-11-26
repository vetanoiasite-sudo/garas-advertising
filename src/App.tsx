import { useEffect, useRef, useState, type ReactNode } from "react";
import { copy, type Lang } from "./i18n";
import { CONTACT } from "./config";
import { BellGlyph, LogoTile } from "./components/Bell";
import TicketBoard from "./components/TicketBoard";
import TrialForm from "./components/TrialForm";

const LANG_KEY = "garas-landing-lang";

function readLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

/** Fades/slides children in the first time they scroll into view. */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${shown ? " in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const featureIcon: Record<string, ReactNode> = {
  booking: <path d="M4 5h16v14H4zM4 10h16M9 5v14M14 5v14" />,
  schedule: <path d="M5 5h14v15H5zM5 10h14M9 3v4M15 3v4M8.5 14h2M13.5 14h2M8.5 17h2" />,
  treasury: <path d="M3 8h18v11H3zM3 8l2-4h14l2 4M12 11.5v4M10 13.5h4" />,
  patients: <path d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />,
  reports: <path d="M6 3h9l4 4v14H6zM15 3v4h4M9 17v-3M12 17v-6M15 17v-4" />,
  roles: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4" />,
};

export default function App() {
  const [lang, setLang] = useState<Lang>(readLang);
  const c = copy[lang];
  const ar = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.title = ar ? "جرس — نظام إدارة العيادات والحجوزات" : "Garas — clinic & booking management";
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* private mode: ignore */ }
  }, [lang, ar]);

  const contactLinks = [
    CONTACT.whatsapp && { href: `https://wa.me/${CONTACT.whatsapp}`, label: c.contact.whatsapp, primary: true },
    CONTACT.phone && { href: `tel:${CONTACT.phone.replace(/\s/g, "")}`, label: `${c.contact.phone} · ${CONTACT.phone}` },
    CONTACT.email && { href: `mailto:${CONTACT.email}`, label: `${c.contact.email} · ${CONTACT.email}` },
  ].filter(Boolean) as { href: string; label: string; primary?: boolean }[];

  const t = c.treasury;
  const fees = t.rows.reduce((s, r) => s + Number(r[1]), 0);
  const opening = 500;
  const total = opening + fees;
  const num = (n: number) => (ar ? n.toLocaleString("ar-EG") : n.toLocaleString("en-US"));

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand" aria-label={c.brand}>
            <LogoTile size={36} />
            <span className="brand-name">{c.brand}<i>.</i></span>
          </a>
          <nav className="nav-links" aria-label="primary">
            <a href="#features">{c.nav.features}</a>
            <a href="#treasury">{c.nav.treasury}</a>
            <a href="#patients">{c.nav.patients}</a>
            <a href="#how">{c.nav.how}</a>
          </nav>
          <div className="nav-actions">
            <button className="lang" onClick={() => setLang(ar ? "en" : "ar")}>{c.langToggle}</button>
            <a className="btn btn-gold btn-sm" href="#contact">{c.cta}</a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-rings" aria-hidden="true"><span /><span /><span /></div>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="kicker rise" style={{ animationDelay: "60ms" }}><BellGlyph size={14} /> {c.hero.kicker}</div>
              <h1 className="display">
                <span className="rise" style={{ animationDelay: "140ms" }}>{c.hero.title1}</span>
                <span className="rise" style={{ animationDelay: "240ms" }}>{c.hero.title2}</span>
                <span className="rise gold" style={{ animationDelay: "340ms" }}>{c.hero.title3}</span>
              </h1>
              <p className="lead rise" style={{ animationDelay: "440ms" }}>{c.hero.lead}</p>
              <div className="hero-ctas rise" style={{ animationDelay: "540ms" }}>
                <a className="btn btn-gold" href="#contact">{c.cta}</a>
                {CONTACT.appUrl
                  ? <a className="btn btn-ghost" href={CONTACT.appUrl}>{c.ctaApp}</a>
                  : <a className="btn btn-ghost" href="#features">{c.nav.features}</a>}
              </div>
              <div className="hero-note rise" style={{ animationDelay: "640ms" }}>{c.hero.note}</div>
            </div>
            <div className="hero-visual rise" style={{ animationDelay: "300ms" }}>
              <TicketBoard c={c} lang={lang} />
            </div>
          </div>
        </section>

        {/* STRIP */}
        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {[...c.strip, ...c.strip, ...c.strip].map((s, i) => (
              <span key={i}>{s}<BellGlyph size={12} /></span>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" className="section">
          <div className="wrap">
            <Reveal><div className="kicker dark">{c.features.kicker}</div></Reveal>
            <Reveal delay={80}><h2 className="h2">{c.features.title}</h2></Reveal>
            <div className="feature-grid">
              {c.features.items.map((f, i) => (
                <Reveal key={f.k} delay={i * 70} className={`feature f-${f.k}`}>
                  <div className="feature-no">{num(i + 1).padStart(2, ar ? "٠" : "0")}</div>
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {featureIcon[f.k]}
                  </svg>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TREASURY */}
        <section id="treasury" className="section section-ink">
          <div className="wrap split">
            <div>
              <Reveal><div className="kicker">{t.kicker}</div></Reveal>
              <Reveal delay={80}><h2 className="h2 light">{t.title}</h2></Reveal>
              <Reveal delay={160}><p className="lead light">{t.lead}</p></Reveal>
            </div>
            <Reveal delay={120}>
              <div className="receipt">
                <div className="receipt-row strong"><span>{t.opening}</span><span>{num(opening)} {t.currency}</span></div>
                <div className="receipt-sep" />
                {t.rows.map(([label, amount], i) => (
                  <div className="receipt-row" key={i}><span>{label}</span><span>+ {num(Number(amount))}</span></div>
                ))}
                <div className="receipt-row muted"><span>{t.fees}</span><span>{num(fees)} {t.currency}</span></div>
                <div className="receipt-sep dashed" />
                <div className="receipt-total"><span>{t.total}</span><b>{num(total)} <small>{t.currency}</small></b></div>
                <div className="receipt-foot">
                  <div><span>{t.closing}</span><b>{num(total)}</b></div>
                  <div className="ok"><span>{t.diff}</span><b>{num(0)}</b></div>
                </div>
                <div className="receipt-teeth" aria-hidden="true" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* PATIENTS */}
        <section id="patients" className="section">
          <div className="wrap split reverse">
            <div>
              <Reveal><div className="kicker dark">{c.patients.kicker}</div></Reveal>
              <Reveal delay={80}><h2 className="h2">{c.patients.title}</h2></Reveal>
              <Reveal delay={160}><p className="lead">{c.patients.lead}</p></Reveal>
            </div>
            <Reveal delay={120}>
              <div className="record">
                <div className="record-head">
                  <span className="avatar" aria-hidden="true">{c.patients.name.slice(0, 1)}</span>
                  <b>{c.patients.name}</b>
                </div>
                <div className="record-stats">
                  {c.patients.stats.map(([k, v]) => (
                    <div key={k}><span>{k}</span><b>{v}</b></div>
                  ))}
                </div>
                <div className="record-list">
                  {c.patients.visits.map((v, i) => (
                    <div className="record-row" key={i}>
                      <span className="when">{v[0]}</span>
                      <span className="who">{v[1]}</span>
                      <span className="tag">{v[2]}</span>
                      <span className={`kind${i === 1 ? " alt" : ""}`}>{v[3]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="section section-cream">
          <div className="wrap">
            <Reveal><div className="kicker dark">{c.how.kicker}</div></Reveal>
            <Reveal delay={80}><h2 className="h2">{c.how.title}</h2></Reveal>
            <ol className="steps">
              {c.how.steps.map((s, i) => (
                <Reveal key={i} delay={i * 110}>
                  <li className="step">
                    <span className="step-no">{num(i + 1)}</span>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="cta">
          <div className="hero-rings small" aria-hidden="true"><span /><span /><span /></div>
          <div className="wrap cta-inner">
            <Reveal><span className="cta-bell"><BellGlyph size={44} color="var(--ink)" /></span></Reveal>
            <Reveal delay={60}><div className="kicker">{c.contact.kicker}</div></Reveal>
            <Reveal delay={120}><h2 className="display small">{c.contact.title}</h2></Reveal>
            <Reveal delay={180}><p className="lead light">{c.contact.lead}</p></Reveal>
            <Reveal delay={240}>
              <div className="cta-links">
                {contactLinks.length > 0
                  ? contactLinks.map((l) => (
                    <a key={l.href} className={`btn ${l.primary ? "btn-gold" : "btn-ghost"}`} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.label}</a>
                  ))
                  : <span className="cta-empty">{c.contact.empty}</span>}
              </div>
            </Reveal>
            <Reveal delay={300} className="trial-wrap">
              <TrialForm c={c} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span className="brand small"><LogoTile size={26} /><span>{c.footer}</span></span>
          <span dir="ltr">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
