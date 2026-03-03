import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "@/components/Image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Menu from "./Menu";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

type LayoutProps = {
    background?: boolean;
    back?: boolean;
    title?: string;
    children: React.ReactNode;
};

const Layout = ({ background, back, title, children }: LayoutProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [isDemo, setIsDemo] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsDemo(localStorage.getItem('folio_demo_mode') === 'true');

        const checkAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/');
            }
        };

        checkAccess();
    }, [router.pathname]);

    return (
        <>
            <Head>
                <title>Bruddle</title>
            </Head>
            {isDemo && (
                <div className="fixed top-0 left-0 w-full z-[100] bg-purple-1 text-white text-xs font-bold text-center py-1.5 flex justify-center items-center gap-2">
                    <Icon name="info" className="icon-16 fill-white" />
                    Demo mode active. Data reset on sign out. Destructive actions disabled.
                </div>
            )}
            <div className={`relative md:pl-0 md:pb-20 ${visible ? "pl-[18.75rem]" : "pl-[18.75rem] xl:pl-20"} ${isDemo ? "pt-8" : ""}`}>
                <Sidebar visible={visible} setVisible={setVisible} />
                <div className="flex flex-col min-h-screen pt-18 md:pt-0 md:min-h-[calc(100vh-5rem)]">
                    <Header back={back} title={title} visible={visible} />
                    <div className="flex w-full grow">
                        <div className="flex flex-col w-full grow max-w-[90rem] mx-auto pt-6 px-16 pb-2 4xl:max-w-full 2xl:px-8 lg:px-6 md:px-5 animate-fade-in">
                            {children}
                        </div>
                    </div>
                    <Footer />
                    {background && (
                        <div className="absolute inset-0 -z-1 overflow-hidden pointer-events-none dark:opacity-70">
                            <div className="absolute z-1 inset-0 bg-n-1 opacity-0 dark:opacity-80"></div>
                            <div className="absolute top-1/2 left-[40vw] -translate-y-[72%] w-[85vw] rotate-180 4xl:w-[85rem] xl:left-[30vw] xl:-top-[20rem] xl:w-[60rem] xl:-translate-y-0 md:-top-[13rem] md:left-[15vw] md:w-[40rem]">
                                <Image
                                    className="w-full"
                                    src="/images/bg.svg"
                                    width={1349}
                                    height={1216}
                                    alt=""
                                />
                            </div>
                        </div>
                    )}
                </div>
                <Menu />
            </div>
        </>
    );
};

export default Layout;
