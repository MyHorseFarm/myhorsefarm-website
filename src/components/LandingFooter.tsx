import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-gray-800 text-white text-center py-5 text-sm">
      <p>&copy; {new Date().getFullYear()} My Horse Farm. All rights reserved.</p>
      <p>
        <Link
          href="/privacy-policy"
          className="text-gray-400 no-underline hover:text-accent transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
