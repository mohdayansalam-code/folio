import Icon from "@/components/Icon";
import Task from "../Task";

type MonthProps = {
    scheduledPosts: any[];
    currentDate: Date;
};

const Month = ({ scheduledPosts, currentDate }: MonthProps) => {
    // Generate the 35-day grid for the current month
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();

    // Get first day of month (0 = Sunday, 1 = Monday ...)
    const firstDay = new Date(year, monthIndex, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // Adjust to Monday Start
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday wraps to end

    // Start date of the grid (previous month overlap)
    const startDate = new Date(year, monthIndex, 1 - startDayOfWeek);

    // Generate 35 days (5 weeks)
    const gridDays = Array.from({ length: 35 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    const isCurrentMonth = (date: Date) => date.getMonth() === monthIndex;

    const getTasksForDate = (date: Date) => {
        return scheduledPosts.filter(post => {
            const postDate = new Date(post.scheduled_at);
            return postDate.getFullYear() === date.getFullYear() &&
                postDate.getMonth() === date.getMonth() &&
                postDate.getDate() === date.getDate();
        });
    };

    return (
        <div className="card">
            <div className="flex -mr-0.25 border-r border-n-1 dark:border-white/40">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="w-[calc(100%/7)] pt-5 px-3 pb-3 text-right text-xs font-bold md:text-center">
                        {day}
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap -mr-0.25">
                {gridDays.map((date: Date, index: number) => {
                    const tasks = getTasksForDate(date);
                    const isActiveMonth = isCurrentMonth(date);

                    return (
                        <div
                            className="w-[calc(100%/7)] h-[8.125rem] pt-2 px-3 pb-4 border-r border-t border-n-1 lg:h-[7.6rem] md:h-[7.6rem] md:px-0 md:text-center dark:border-white/40"
                            key={index}
                        >
                            <div
                                className={`mb-1 text-right text-sm font-medium md:text-center ${isActiveMonth ? "text-primary " : "text-muted /50"
                                    }`}
                            >
                                {date.getDate()}
                            </div>

                            {tasks.slice(0, 2).map((task: any) => (
                                <Task
                                    className="mb-1 lg:h-5 lg:bg-transparent lg:p-0 md:w-full md:h-6 md:mb-1 md:justify-center dark:lg:bg-transparent"
                                    classTitle="md:hidden"
                                    item={{
                                        ...task,
                                        title: task.content ? (task.content.length > 20 ? task.content.substring(0, 20) + "..." : task.content) : "Draft",
                                        time: new Date(task.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        color: task.status === 'scheduled' ? '#3BBD5B' : '#9966FF' // Green for scheduled, Purple for drafted/other
                                    }}
                                    key={task.id}
                                />
                            ))}

                            {tasks.length > 2 && (
                                <button className="group inline-flex items-center mt-1 px-1 text-xs font-bold transition-colors hover:text-purple-1 lg:-ml-1 lg:px-0 md:text-0 md:mt-0.5 md:ml-0">
                                    <Icon
                                        className="mr-1 transition-colors dark:fill-white group-hover:fill-purple-1 md:mr-0"
                                        name="dots-vertical"
                                    />
                                    More<span className="ml-1 lg:hidden"> events</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Month;
