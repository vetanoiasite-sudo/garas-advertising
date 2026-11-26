import { useEffect, useState } from "react";
import { BellGlyph } from "./Bell";
import type { Copy } from "../i18n";

/* The hero's signature piece: a live booking-number board, like the clinic
 * app's number picker. Numbers fill with patient names one by one, the
 * "now serving" number advances, and the bell rings each time it does. */
const TOTAL = 12;
const HELD = 1; // number 1 held for walk-ins, as in the app

export default function TicketBoard({ c, lang }: { c: Copy; lang: string }) {
  const names = c.board.names;
  // `booked`: how many numbers after the held ones are taken. `serving` is
  // always one of those taken numbers — the clinic only calls booked patients.
  const [state, setState] = useState({ booked: 4, serving: HELD + 1, ring: 0 });
  const { booked, serving, ring } = state;

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setState((s) => {
        const nextServing = s.serving + 1;
        // Day over: everyone was called — start a fresh queue.
        if (nextServing > HELD + names.length) return { booked: 3, serving: HELD + 1, ring: s.ring + 1 };
        // Keep the queue ahead of the caller: a new booking lands each tick.
        const nextBooked = Math.min(names.length, Math.max(s.booked + 1, nextServing - HELD));
        return { booked: nextBooked, serving: nextServing, ring: s.ring + 1 };
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [names.length]);

  const fmt = (n: number) => (lang === "ar" ? n.toLocaleString("ar-EG") : String(n));

  return (
    <div className="board" role="img" aria-label={`${c.board.title} — ${c.board.now} ${fmt(serving)}`}>
      <div className="board-head">
        <div>
          <div className="board-title">{c.board.title}</div>
          <div className="board-sub">{c.board.doctor}</div>
        </div>
        <div className="board-now">
          <span key={ring} className="bell-ring">
            <BellGlyph size={22} color="var(--ink)" />
          </span>
          <div>
            <div className="board-now-label">{c.board.now}</div>
            <div key={`n${serving}`} className="board-now-num">{fmt(serving)}</div>
          </div>
        </div>
      </div>

      <div className="board-grid">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => {
          const held = n <= HELD;
          const nameIdx = n - HELD - 1;
          const taken = !held && nameIdx < booked && nameIdx < names.length;
          const isServing = n === serving;
          return (
            <div
              key={n}
              className={`tile${held ? " held" : ""}${taken ? " taken" : ""}${isServing ? " serving" : ""}`}
            >
              <span className="tile-num">{fmt(n)}</span>
              <span className="tile-name">
                {held ? c.board.held : taken ? names[nameIdx] : c.board.free}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
