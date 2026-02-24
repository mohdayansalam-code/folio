import Link from "next/link";

const Footer = () => {
    return (
        <footer className="mt-auto py-6 border-t border-n-1 dark:border-white/10 text-muted text-sm font-bold flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                © 2026 Folio Inc.
            </div>
            <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-purple-1 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-purple-1 transition-colors">Terms of Service</Link>
                <a href="mailto:support@folio.com" className="hover:text-purple-1 transition-colors">Contact Support</a>
            </div>
        </footer>
    );
};

export default Footer;
