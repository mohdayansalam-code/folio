import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import Field from "@/components/Field";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";

const countries = [
    {
        id: "0",
        title: "United States",
    },
    {
        id: "1",
        title: "Ukraine",
    },
    {
        id: "2",
        title: "France",
    },
];

type SignUpProps = {};

const SignUp = ({ }: SignUpProps) => {
    const router = useRouter();
    const [country, setCountry] = useState<any>(countries[0]);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [agreeEmail, setAgreeEmail] = useState<boolean>(true);
    const [conditions, setConditions] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("SIGNUP CLICKED");
        setError(null);

        if (!conditions) {
            setError("You must agree to the Terms of Service.");
            return;
        }

        setIsLoading(true);

        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        console.log({ data, signupError });

        if (signupError) {
            setError(signupError.message);
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
            <form onSubmit={handleSignup}>
                {error && (
                    <div className="mb-4 p-3 rounded-md bg-pink-1/10 border border-pink-1/20 text-pink-1 text-sm font-bold text-center">
                        {error}
                    </div>
                )}
                <div className="mb-1 text-h1 text-n-7 dark:text-white">Sign up</div>
                <div className="mb-12 text-sm text-n-7 dark:text-white/70">
                    Before we start, please enter your current location
                </div>
                <Select
                    className="mb-4.5"
                    label="Country/Area of Residence"
                    items={countries}
                    value={country}
                    onChange={setCountry}
                />
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
                <div className="mb-3.5 text-n-7 dark:text-white">
                    <Checkbox
                        label="I agree to receive email updates"
                        value={agreeEmail}
                        onChange={() => setAgreeEmail(!agreeEmail)}
                    />
                </div>
                <div className="mb-6.5 text-n-7 dark:text-white">
                    <Checkbox
                        label="I have read and agree to Terms of Service"
                        value={conditions}
                        onChange={() => setConditions(!conditions)}
                    />
                </div>
                <button
                    className={`btn-purple btn-shadow w-full h-14 ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </button>
            </form>
        </>
    );
};

export default SignUp;
