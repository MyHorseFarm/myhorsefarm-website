import Link from "next/link";
import { SOCIAL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-5 text-center">
      <div className="flex justify-center gap-5 mb-2">
        <a href={SOCIAL.facebook} target="_blank" rel="noopener" className="text-white text-xl hover:text-accent transition-colors">
          <i className="fab fa-facebook-f" />
        </a>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="text-white text-xl hover:text-accent transition-colors">
          <i className="fab fa-instagram" />
        </a>
        <a href={SOCIAL.youtube} target="_blank" rel="noopener" className="text-white text-xl hover:text-accent transition-colors">
          <i className="fab fa-youtube" />
        </a>
        <a href={SOCIAL.google} target="_blank" rel="noopener" className="text-white text-xl hover:text-accent transition-colors">
          <i className="fab fa-google" />
        </a>
      </div>
      <p className="mt-2.5 text-sm">
        <Link href="/privacy-policy" className="text-gray-400 no-underline hover:text-accent transition-colors">
          Privacy Policy
        </Link>
        <span className="mx-2 text-gray-500">|</span>
        <Link href="/terms-of-service" className="text-gray-400 no-underline hover:text-accent transition-colors">
          Terms of Service
        </Link>
      </p>
      <p>&copy; {new Date().getFullYear()} My Horse Farm. All rights reserved.</p>
    </footer>
  );
}
