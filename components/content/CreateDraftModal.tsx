import { useState } from "react";
import Icon from "@/components/Icon";

interface CreateDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string) => Promise<void>;
    isLoading: boolean;
}

export default function CreateDraftModal({
    isOpen,
    onClose,
    onCreate,
    isLoading,
}: CreateDraftModalProps) {
    const [title, setTitle] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!title.trim()) return;
        await onCreate(title.trim());
        setTitle("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-n-8/80 dark:bg-n-1/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-n-2 w-full max-w-md rounded-xl p-8 shadow-primary-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-n-4 hover:text-n-7 dark:hover:text-white transition-colors"
                    disabled={isLoading}
                >
                    <Icon name="close" className="w-5 h-5 fill-current" />
                </button>

                <h2 className="text-h3 mb-2">Create New Draft</h2>
                <div className="text-secondary mb-6">Enter a descriptive title for your content draft.</div>

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="e.g., 5 Ways to Optimize Your Workflow"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && title.trim() && !isLoading) {
                                handleSubmit();
                            }
                        }}
                        autoFocus
                        className="w-full border-2 border-n-3 dark:border-white/10 bg-transparent rounded-xl px-4 h-14 text-sm focus:border-purple-1 outline-none transition-colors"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="btn-stroke h-12 px-6"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || isLoading}
                        className={`btn-purple h-12 px-6 ${!title.trim() || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Icon name="loader" className="w-4 h-4 animate-spin fill-white" />
                                Creating...
                            </span>
                        ) : (
                            "Create Draft"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
