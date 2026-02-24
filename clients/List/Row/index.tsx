import { useState } from "react";
import Link from "next/link";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";

type RowProps = {
    item: any;
};

const Row = ({ item }: RowProps) => {
    const [value, setValue] = useState<boolean>(false);

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
            <td className="td-custom text-right">
                <button className="btn-transparent-dark btn-small btn-square">
                    <Icon name="dots" />
                </button>
            </td>
        </tr>
    );
};

export default Row;
