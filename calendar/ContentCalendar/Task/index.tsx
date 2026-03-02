type TaskProps = {
    className?: string;
    classTitle?: string;
    item: any;
    time?: string;
};

const Task = ({ className, classTitle, item, time }: TaskProps) => {
    return (
        <div
            className={`relative flex items-center w-full pl-2.5 pr-4 py-1 bg-background transition-colors text-xs outline-none last:mb-0 dark:bg-n-2 cursor-default ${className}`}
        >
            <div
                className={`shrink-0 w-1.5 h-1.5 rounded-full ${item.color === "green"
                        ? "bg-green-1"
                        : item.color === "yellow"
                            ? "bg-yellow-1"
                            : "bg-purple-1"
                    }`}
            ></div>
            {time && (
                <div className="min-w-[3.3rem] ml-2.5 mr-3 text-left text-muted /75">
                    {time}
                </div>
            )}
            <div
                className={`ml-2 truncate text-xs font-bold ${classTitle}`}
            >
                {item.title}
            </div>
        </div>
    );
};

export default Task;
