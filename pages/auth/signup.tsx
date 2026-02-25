import Head from "next/head";
import Link from "next/link";
import SignupPage from "../../auth/Signup";

export default function Signup() {
    return (
        <div className="flex min-h-screen bg-n-1 dark:bg-n-2 font-sans selection:bg-purple-1/30">
            <Head>
                <title>Sign Up | Folio</title>
            </Head>

            {/* Left Box (Form) */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-5 w-full max-w-[35rem] mx-auto z-10 relative bg-n-1 dark:bg-n-2 py-12 md:py-24 overflow-y-auto scrollbar-none">
                <Link href="/" className="absolute top-8 left-8 md:top-6 md:left-5 text-h4 font-bold tracking-tight text-n-7 dark:text-white hover:text-purple-1 transition-colors z-20">
                    Folio
                </Link>
                <div className="w-full max-w-[23.5rem] mx-auto mt-8 md:mt-0">
                    <SignupPage />

                    <div className="mt-8 text-center text-sm font-medium text-secondary">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-purple-1 hover:text-purple-1/80 transition-colors font-bold">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Box (Art) */}
            <div className="flex-[1.5] bg-n-2 border-l border-n-1 dark:bg-n-1/50 dark:border-white/5 relative flex md:hidden items-center justify-center overflow-hidden">
                {/* Gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-1/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -mt-40 -ml-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-1/10 rounded-full blur-[80px] pointer-events-none mt-40 ml-40"></div>

                {/* Abstract shape */}
                <div className="relative z-10 w-96 h-96 rounded-[2rem] bg-n-1 dark:bg-n-2 border border-n-1 dark:border-white/10 shadow-primary-4 transform -rotate-3 flex flex-col overflow-hidden">
                    <div className="h-12 border-b border-n-1 dark:border-white/10 flex items-center px-6 gap-2 bg-n-2/50 dark:bg-n-1/50">
                        <div className="w-3 h-3 rounded-full bg-red-1/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-1/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-1/50"></div>
                    </div>
                    <div className="flex-1 p-8 border-t border-white/20 dark:border-transparent flex flex-col justify-between bg-gradient-to-br from-blue-500/10 via-n-1 to-purple-1/10 dark:from-blue-500/5 dark:via-n-2 dark:to-purple-1/5">
                        <div className="w-16 h-16 rounded-2xl bg-n-1 dark:bg-n-2 shadow-primary-4 border border-n-1 dark:border-white/10 flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-sm -rotate-12"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-5/6 h-4 rounded-full bg-blue-500/20"></div>
                            <div className="w-2/3 h-4 rounded-full bg-purple-1/20"></div>
                            <div className="w-1/2 h-4 rounded-full bg-pink-1/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
