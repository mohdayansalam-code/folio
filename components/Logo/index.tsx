import Link from "next/link";
import Image from "@/components/Image";

type TestProps = {
    className?: string;
    light?: boolean;
};

const Test = ({ className, light }: TestProps) => {
    const isDarkMode = true; // Hardcoded to true for Next.js dark theme

    return (
        <Link className={`flex w-[7.125rem] ${className}`} href="/">
            <span className="text-h3 font-bold text-brand mt-1">
                Folio
            </span>
        </Link>
    );
};

export default Test;
