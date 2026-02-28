import { useState, useEffect } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useRouter } from "next/router";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Create from "./Create";
import Apps from "./Apps";
import { supabase } from "@/utils/supabase";
import ThemeToggle from "@/components/Header/ThemeToggle";

type HeaderProps = {
    back?: boolean;
    title?: string;
    visible?: boolean;
};

const Header = ({ back, title, visible }: HeaderProps) => {
    const [headerStyle, setHeaderStyle] = useState<boolean>(false);
    const [planData, setPlanData] = useState<{ plan: string, usages: number } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Plan validation logic removed for pure email-only SaaS.
        setPlanData({ plan: 'free', usages: 0 });
    }, []);

    useScrollPosition(({ currPos }) => {
        setHeaderStyle(currPos.y <= -1);
    });

    return (
        <header
            className={`fixed top-0 right-0 z-20 border-b border-n-1 md:left-0 md:relative dark:border-white ${visible ? "left-[18.75rem]" : "left-[18.75rem] xl:left-20"
                } ${headerStyle
                    ? "bg-background dark:bg-n-2 md:!bg-transparent"
                    : ""
                }`}
        >
            <div className="flex items-center max-w-[90rem] m-auto w-full h-18 px-16 2xl:px-8 lg:px-6 md:px-5">
                {back && (
                    <button
                        className="btn-stroke btn-square btn-medium shrink-0 mr-6 2xl:mr-4 md:!w-6 md:h-6 md:mr-3"
                        onClick={() => router.back()}
                    >
                        <Icon name="arrow-prev" />
                    </button>
                )}
                {title && (
                    <div className="mr-4 text-h3 truncate md:mr-2 md:text-h4">
                        {title}
                    </div>
                )}
                <div className="flex items-center shrink-0 ml-auto">
                    {planData && planData.plan === 'free' && (
                        <div className="hidden md:flex lg:flex xl:flex 2xl:flex items-center px-4 py-1.5 mr-4 bg-yellow-1/10 border border-yellow-1/20 rounded-full">
                            <Icon className="icon-16 fill-yellow-1 mr-2" name="lightning" />
                            <span className="text-xs font-bold text-yellow-1">Free Plan – 1 Client / 3 AI Runs</span>
                        </div>
                    )}
                    <button className="btn-transparent-dark btn-square btn-medium mr-2 md:!w-6 md:h-6">
                        <Icon name="search" />
                    </button>
                    <button className="btn-transparent-dark btn-square btn-medium relative mr-2 md:w-6 md:h-6">
                        <Icon name="notification" />
                        <div className="absolute top-1.5 right-[0.5625rem] w-2 h-2 border border-white rounded-full bg-green-1 md:top-0.5 md:right-[0.5rem] dark:border-n-2"></div>
                    </button>
                    <ThemeToggle />
                    <Apps />
                    <Create />
                    <button className="relative hidden w-8 h-8 ml-1 md:block">
                        <Image
                            className="rounded-full object-cover"
                            src="/images/avatars/avatar.jpg"
                            fill
                            alt="Avatar"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
