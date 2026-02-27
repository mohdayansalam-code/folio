import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";

type RowProps = {
    item: any;
    onUpdate: () => void;
};

const Row = ({ item, onUpdate }: RowProps) => {
    const [value, setValue] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLTableDataCellElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEdit = async () => {
        const newName = window.prompt("Enter new client name:", item.name);
        if (newName && newName.trim() !== item.name) {
            await supabase.from('clients').update({ name: newName.trim() }).eq('id', item.id);
            onUpdate();
        }
        setShowMenu(false);
    };

    const handleToggleStatus = async () => {
        const newStatus = item.status === 'active' ? 'paused' : 'active';
        await supabase.from('clients').update({ status: newStatus }).eq('id', item.id);
        onUpdate();
        setShowMenu(false);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${item.name}? This cannot be undone.`)) {
            await supabase.from('clients').delete().eq('id', item.id);
            onUpdate();
        }
        setShowMenu(false);
    };

    return (
        <tr className="">
            <td className="td-custom">
                <Checkbox value={value} onChange={() => setValue(!value)} />
            </td>
            <td className="td-custom">
                <Link
                    className="flex items-center text-sm font-bold transition-colors hover:text-purple-1"
                    href="/clients"
                >
                    <div className="relative w-8 h-8 mr-3 rounded-full bg-purple-1/20 flex items-center justify-center text-purple-1">
                        {item.name.charAt(0)}
                    </div>
                    {item.name}
                </Link>
            </td>
            <td className="td-custom font-medium">
                <div className="flex items-center">
                    <Icon className="relative -top-0.25 mr-1.5 dark:fill-white icon-18" name="calendar" />
                    {new Date(item.created_at).toLocaleDateString()}
                </div>
            </td>
            <td className="td-custom font-medium">
                <div className="flex items-center">
                    <Icon className="relative -top-0.25 mr-1.5 dark:fill-white icon-18" name="email-1" />
                    <div className="2xl:max-w-[9rem] 2xl:truncate">
                        {item.linkedin_url || "N/A"}
                    </div>
                </div>
            </td>
            <td className="td-custom font-medium">
                <div className="flex items-center">
                    <Icon className="relative -top-0.25 mr-1.5 dark:fill-white icon-18" name="cart" />
                    {item.niche || "N/A"}
                </div>
            </td>
            <td className="td-custom text-right font-bold w-32">
                <span className={`px-2 py-1 rounded-sm text-xs capitalize ${item.status === 'active' ? 'bg-[#EAF3EB] text-[#298335] dark:bg-[#1E2D28] dark:text-[#3BBD5B]' : 'bg-n-3/20 text-muted'}`}>
                    {item.status}
                </span>
            </td>
            <td className="td-custom text-right relative" ref={menuRef}>
                <button
                    className="btn-transparent-dark btn-small btn-square"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <Icon name="dots" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl z-10 py-2 overflow-hidden">
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-n-7 dark:text-white transition-colors" onClick={handleEdit}>
                            Edit Name
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-n-7 dark:text-white transition-colors" onClick={handleToggleStatus}>
                            {item.status === 'active' ? 'Pause' : 'Resume'} Client
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-red-1 transition-colors" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default Row;
