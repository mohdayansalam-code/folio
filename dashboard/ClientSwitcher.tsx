import { useState } from "react";
import Select from "@/components/Select";
import Icon from "@/components/Icon";

const ClientSwitcher = () => {
    const clients = [
        { id: 1, title: "Elon Musk", avatar: "/images/avatars/elon.jpg" },
        { id: 2, title: "Sam Altman", avatar: "/images/avatars/sam.jpg" },
        { id: 3, title: "Jensen Huang", avatar: "/images/avatars/jensen.jpg" },
    ];
    const [client, setClient] = useState(clients[0]);

    return (
        <div className="mb-8 p-4 bg-n-1 border border-white/10 rounded-sm">
            <div className="text-xs font-bold text-white/50 mb-3 uppercase tracking-wider">Active Client</div>
            <Select
                className="w-full"
                classButton="h-12 bg-n-1 border-white/20 text-white hover:border-purple-1"
                classOptions="bg-n-1 border-white/20 text-white"
                classOption="text-white/70 hover:text-white hover:bg-white/10"
                items={clients}
                value={client}
                onChange={setClient}
                placeholder="Select Client"
                small
            />
            <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 mr-3">
                    <img src={client.avatar} alt={client.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-bold text-white">{client.title}</div>
                <div className="ml-auto label-stroke-green !h-5 !px-2 !text-[10px]">Active</div>
            </div>
        </div>
    );
};

export default ClientSwitcher;
