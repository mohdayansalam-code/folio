import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import Icon from "@/components/Icon";

type TaskCardProps = {
    item: any;
    index: number;
};

const TaskCard = ({ item, index }: TaskCardProps) => {
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div
                        className={`card flex flex-col mt-2 px-4 py-5 transition-all duration-200 ease-out cursor-grab active:cursor-grabbing hover:!border-purple-1 ${snapshot.isDragging ? "!shadow-primary-6 -translate-y-[2px]" : ""
                            }`}
                    >
                        <div className="mb-2 font-bold line-clamp-2">
                            {item.content ? (item.content.length > 40 ? item.content.substring(0, 40) + "..." : item.content) : "New Draft"}
                        </div>

                        {item.content && (
                            <div className="text-xs text-secondary mb-4 line-clamp-3">
                                {item.content}
                            </div>
                        )}

                        <div className="flex items-center mt-auto">
                            <div className="label-stroke min-w-[5.875rem] mr-auto text-center">
                                {new Date(item.created_at).toLocaleDateString()}
                            </div>

                            {item.scheduled_at && (
                                <div className="flex items-center text-xs font-bold text-secondary">
                                    <Icon className="icon-16 mr-1.5 dark:fill-white" name="calendar" />
                                    {new Date(item.scheduled_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
