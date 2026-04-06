export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ads-landing" style={{ paddingTop: 0, marginTop: "-60px" }}>
      <style>{`
        .ads-landing { position: relative; z-index: 50; }
        .ads-landing ~ * { display: none !important; }
        nav { display: none !important; }
        .pt-\\[60px\\] { padding-top: 0 !important; }
      `}</style>
      {children}
    </div>
  );
}
