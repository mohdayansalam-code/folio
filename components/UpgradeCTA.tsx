import Icon from "@/components/Icon";
import { useToast } from "@/components/Toast";

interface UpgradeCTAProps {
    title?: string;
    description: string;
    inline?: boolean;
}

export default function UpgradeCTA({ title = "Upgrade to Pro", description, inline = false }: UpgradeCTAProps) {
    const { addToast } = useToast();

    const handleUpgrade = () => {
        addToast("Billing coming soon", "success");
    };

    if (inline) {
        return (
            <div className="card shadow-primary-4 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-1/30 bg-purple-1/5">
                <div>
                    <div className="text-h6 mb-1 text-purple-1 flex items-center gap-2">
                        <Icon name="lock" className="w-4 h-4 fill-current" />
                        {title}
                    </div>
                    <div className="text-sm text-secondary">{description}</div>
                </div>
                <button
                    onClick={handleUpgrade}
                    className="btn-purple h-10 px-5 shrink-0"
                >
                    Upgrade Now
                </button>
            </div>
        );
    }

    return (
        <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-1 to-blue-1"></div>
            <Icon className="icon-28 mb-4 text-purple-1 dark:fill-white/50" name="lock" />
            <div className="text-h3 mb-2">{title}</div>
            <div className="text-secondary mb-8 max-w-md mx-auto">
                {description}
            </div>
            <button
                onClick={handleUpgrade}
                className="btn-purple btn-shadow h-12 px-8"
            >
                Upgrade to Pro
            </button>
        </div>
    );
}
