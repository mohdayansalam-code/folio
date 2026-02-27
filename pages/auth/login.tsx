import Head from "next/head";
import Link from "next/link";
import LoginPage from "../../auth/Login";

export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    }
}

export default function Login() {
    return (
        <div className="flex min-h-screen bg-n-1 dark:bg-n-2 font-sans selection:bg-purple-1/30">
            <Head>
                <title>Log In | Folio</title>
            </Head>

            {/* Left Box (Form) */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-5 w-full max-w-[35rem] mx-auto z-10 relative bg-n-1 dark:bg-n-2">
                <Link href="/" className="absolute top-8 left-8 md:top-6 md:left-5 text-h4 font-bold tracking-tight text-n-7 dark:text-white hover:text-purple-1 transition-colors">
                    Folio
                </Link>
                <div className="w-full max-w-[23.5rem] mx-auto">
                    <LoginPage onRecover={() => { }} onLoginQr={() => { }} />

                    <div className="mt-8 text-center text-sm font-medium text-secondary">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-purple-1 hover:text-purple-1/80 transition-colors font-bold">
                            Sign up for beta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Box (Art) */}
            <div className="flex-[1.5] bg-n-2 border-l border-n-1 dark:bg-n-1/50 dark:border-white/5 relative flex md:hidden items-center justify-center overflow-hidden">
                {/* Gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-1/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-1/10 rounded-full blur-[80px] pointer-events-none -mt-40 -ml-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none mt-40 ml-40"></div>

                {/* Abstract shape */}
                <div className="relative z-10 w-96 h-96 rounded-[2rem] bg-n-1 dark:bg-n-2 border border-n-1 dark:border-white/10 shadow-primary-4 transform rotate-3 flex flex-col overflow-hidden">
                    <div className="h-12 border-b border-n-1 dark:border-white/10 flex items-center px-6 gap-2 bg-n-2/50 dark:bg-n-1/50">
                        <div className="w-3 h-3 rounded-full bg-red-1/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-1/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-1/50"></div>
                    </div>
                    <div className="flex-1 p-8 flex border-t border-white/20 dark:border-transparent flex-col justify-between bg-gradient-to-br from-purple-1/10 via-n-1 to-pink-1/10 dark:from-purple-1/5 dark:via-n-2 dark:to-pink-1/5">
                        <div className="w-16 h-16 rounded-full bg-n-1 dark:bg-n-2 shadow-primary-4 border border-n-1 dark:border-white/10 flex items-center justify-center">
                            <div className="w-6 h-6 bg-purple-1 rounded-sm rotate-12"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-3/4 h-4 rounded-full bg-purple-1/20"></div>
                            <div className="w-1/2 h-4 rounded-full bg-pink-1/20"></div>
                            <div className="w-5/6 h-4 rounded-full bg-orange-500/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
