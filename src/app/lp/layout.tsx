import LandingCallBar from "@/components/LandingCallBar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-[44px]">
      <LandingCallBar />
      {children}
    </div>
  );
}
