import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import Field from "@/components/Field";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";

type SignInProps = {
    onRecover: () => void;
    onLoginQr: () => void;
};

const SignIn = ({ onRecover, onLoginQr }: SignInProps) => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("LOGIN CLICKED");
        setError(null);
        setIsLoading(true);

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log({ data, signInError });

        if (signInError) {
            setError(signInError.message);
            setIsLoading(false);
            return;
        }

        if (data?.user) {
            router.push("/dashboard");
        } else {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSignin}>
                {error && (
                    <div className="mb-4 p-3 rounded-md bg-pink-1/10 border border-pink-1/20 text-pink-1 text-sm font-bold text-center">
                        {error}
                    </div>
                )}
                <div className="mb-1 text-h1 text-n-7 dark:text-white">Sign in</div>
                <div className="mb-12 text-sm text-n-7 dark:text-white/70">
                    Enter your account details or use QR code
                </div>
                <Field
                    className="mb-4.5"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    icon="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                />
                <Field
                    className="mb-6.5"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    required
                />
                <div className="flex justify-between items-center mb-6.5 text-n-7 dark:text-white">
                    <Checkbox
                        label="Remember me"
                        value={remember}
                        onChange={() => setRemember(!remember)}
                    />
                    <button
                        className="mt-0.5 text-xs font-bold transition-colors hover:text-purple-1 text-n-7 dark:text-white/80"
                        onClick={onRecover}
                    >
                        Recover password
                    </button>
                </div>
                <button
                    className={`btn-purple btn-shadow w-full h-14 ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>
                <div className="flex justify-center items-center py-6 text-n-7 dark:text-white">
                    <span className="w-full max-w-[8.25rem] h-0.25 bg-n-1 dark:bg-white/20"></span>
                    <span className="mx-4 text-sm font-medium">or</span>
                    <span className="w-full max-w-[8.25rem] h-0.25 bg-n-1 dark:bg-white/20"></span>
                </div>
                <button
                    className="btn-stroke w-full h-14"
                    type="button"
                    onClick={onLoginQr}
                >
                    <Icon name="qr-code" />
                    <span>Log in with QR code</span>
                </button>
            </form>
        </>
    );
};

export default SignIn;
