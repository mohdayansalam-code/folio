import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";

type ItemProps = {
    item: any;
    onUpdateClient: (id: string, updates: any) => void;
    onDeleteClient: (id: string) => void;
};

const Item = ({ item, onUpdateClient, onDeleteClient }: ItemProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newName = window.prompt("Enter new client name:", item.name);
        if (newName && newName.trim() !== item.name) {
            const trimmedName = newName.trim();
            await supabase.from('clients').update({ name: trimmedName }).eq('id', item.id);
            onUpdateClient(item.id, { name: trimmedName });
        }
        setShowMenu(false);
    };

    const handleToggleStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newStatus = item.status === 'active' ? 'paused' : 'active';
        await supabase.from('clients').update({ status: newStatus }).eq('id', item.id);
        onUpdateClient(item.id, { status: newStatus });
        setShowMenu(false);
    };

    const handleDelete = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (window.confirm(`Are you sure you want to delete ${item.name}? This cannot be undone.`)) {
            await supabase.from('clients').delete().eq('id', item.id);
            onDeleteClient(item.id);
        }
        setShowMenu(false);
    };

    return (
        <div className="flex items-center px-4 py-3 border-b border-n-1 last:border-none dark:border-white relative">
            <Link href="/clients" className="relative w-8 h-8 rounded-full bg-purple-1/20 flex items-center justify-center text-purple-1 font-bold shrink-0">
                {item.name.charAt(0)}
            </Link>
            <Link href="/clients" className="grow pl-3.5 block">
                <div className="flex justify-between text-sm font-bold">
                    <div>{item.name}</div>
                    <div className={`text-xs ${item.status === 'active' ? 'text-[#298335] dark:text-[#3BBD5B]' : 'text-muted'}`}>{item.status}</div>
                </div>
                <div className="flex justify-between text-xs text-secondary mt-1">
                    <div>{item.niche}</div>
                    <div className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
            </Link>
            <div className="relative shrink-0 ml-3" ref={menuRef}>
                <button
                    className="btn-transparent-dark btn-small btn-square"
                    onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                >
                    <Icon name="dots" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl z-20 py-2 overflow-hidden shadow-lg">
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-n-7 dark:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
                            Edit Name
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-n-7 dark:text-white transition-colors" onClick={(e) => { e.preventDefault(); handleToggleStatus(); }}>
                            {item.status === 'active' ? 'Pause' : 'Resume'} Client
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-n-2/5 dark:hover:bg-white/5 text-sm font-bold text-red-1 transition-colors" onClick={(e) => { e.preventDefault(); handleDelete(); }}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;
