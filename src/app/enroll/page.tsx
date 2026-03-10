import type { Metadata } from "next";
import Image from "next/image";
import EnrollmentForm from "@/components/EnrollmentForm";

export const metadata: Metadata = {
  title: "Enroll – Card on File",
  robots: { index: false, follow: false },
};

export default function EnrollPage() {
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center gap-3">
          <Image src="/logo.png" alt="My Horse Farm" width={40} height={40} />
          <span className="text-lg font-bold text-green-900">My Horse Farm</span>
        </div>
      </header>
      <main className="px-4 py-8">
        <EnrollmentForm squareAppId={appId} squareLocationId={locationId} />
      </main>
    </div>
  );
}
