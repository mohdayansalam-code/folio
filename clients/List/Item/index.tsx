import Link from "next/link";

type ItemProps = {
    item: any;
};

const Item = ({ item }: ItemProps) => (
    <Link
        className="flex items-center px-4 py-3 border-b border-n-1 last:border-none dark:border-white"
        href="/clients"
    >
        <div className="relative w-8 h-8 rounded-full bg-purple-1/20 flex items-center justify-center text-purple-1 font-bold">
            {item.name.charAt(0)}
        </div>
        <div className="grow">
            <div className="pl-3.5">
                <div className="flex justify-between text-sm font-bold">
                    <div>{item.name}</div>
                    <div className={`text-xs ${item.status === 'active' ? 'text-[#298335] dark:text-[#3BBD5B]' : 'text-muted'}`}>{item.status}</div>
                </div>
                <div className="flex justify-between text-xs text-secondary">
                    <div>{item.niche}</div>
                    <div>{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    </Link>
);

export default Item;
