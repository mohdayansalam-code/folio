import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Menu from "./Menu";

type SidebarProps = {
    visible: boolean;
    setVisible: (value: boolean) => void;
};

const Sidebar = ({ visible, setVisible }: SidebarProps) => {

    return (
        <div
            className={`fixed top-0 left-0 flex flex-col h-screen w-[18.75rem] pt-6 px-8 pb-4.5 bg-n-1 xl:z-30 md:hidden ${visible ? "w-[18.75rem]" : "xl:w-20"
                }`}
        >
            <div className="flex-none">
                <div className="flex justify-between items-center h-[1.625rem] mb-11">
                    <div className="flex items-center gap-2 mt-1">
                        <Logo className={visible ? "flex" : "xl:hidden"} light />
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-purple-1 bg-purple-1/20 uppercase tracking-widest ${visible ? "block" : "xl:hidden"}`}>Beta</span>
                    </div>
                    <button
                        className="hidden xl:flex"
                        onClick={() => setVisible(!visible)}
                    >
                        <Icon
                            className="fill-white"
                            name={visible ? "close" : "burger"}
                        />
                    </button>
                </div>
                <Menu visible={visible} />
            </div>

            <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-none -mx-8 px-8">
            </div>

            <div
                className={`flex-none sticky bottom-0 bg-n-1 flex items-center h-18 mt-auto mx-0 pt-10 ${visible ? "mx-0" : "xl:-mx-4"
                    }`}
            >
                <Link
                    className={`inline-flex items-center font-bold text-white text-sm transition-colors hover:text-purple-1 ${visible ? "mx-0 text-sm" : "xl:mx-auto xl:text-0"
                        }`}
                    href="/profile"
                >
                    <div
                        className={`relative w-5.5 h-5.5 mr-2.5 rounded-full overflow-hidden ${visible ? "mr-2.5" : "xl:mr-0"
                            }`}
                    >
                        <Image
                            className="object-cover scale-105"
                            src="/images/avatars/avatar.jpg"
                            fill
                            alt="Avatar"
                        />
                    </div>
                    Henry Richardson
                </Link>
                <button
                    className={`btn-transparent-light btn-square btn-small ml-auto ${visible ? "flex" : "xl:hidden"
                        }`}
                >
                    <Icon name="dots" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
