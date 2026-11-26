/* The جرس bell — same shape as the clinic app's logo (web/components/ui/Logo.tsx). */
const BODY =
  "M12 2.6c.9 0 1.6.7 1.6 1.6v.5c2.6.7 4.4 3.1 4.4 5.8v3.9l1.7 2.3c.4.6 0 1.4-.7 1.4H5c-.7 0-1.1-.8-.7-1.4L6 14.4v-3.9c0-2.7 1.8-5.1 4.4-5.8v-.5c0-.9.7-1.6 1.6-1.6Z";
const CLAPPER = "M9.7 19.3h4.6a2.3 2.3 0 0 1-4.6 0Z";

export function BellGlyph({ size = 22, color = "currentColor", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={BODY} fill={color} />
      <path d={CLAPPER} fill={color} />
    </svg>
  );
}

export function LogoTile({ size = 38 }: { size?: number }) {
  return (
    <span className="logo-tile" style={{ width: size, height: size }} aria-hidden="true">
      <BellGlyph size={Math.round(size * 0.62)} color="var(--ink)" />
    </span>
  );
}
