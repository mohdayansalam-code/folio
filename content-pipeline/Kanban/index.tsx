import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Icon from "@/components/Icon";
import TaskCard from "./TaskCard";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";
import Select from "@/components/Select";

const initialColumns: Record<string, any> = {
    draft: { title: "Drafting", color: "#FF9966", items: [] },
    scheduled: { title: "Scheduled", color: "#3BBD5B", items: [] },
    published: { title: "Published", color: "#319DFF", items: [] },
};

const KanbanDescPage = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchClients = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (email) {
                const { data } = await supabase.from('clients').select('id, name').eq('user_email', email);
                if (data && data.length > 0) {
                    const mapped = data.map(c => ({ id: c.id, title: c.name }));
                    setClients([{ id: 'all', title: 'All Clients' }, ...mapped]);
                    setSelectedClient({ id: 'all', title: 'All Clients' });
                }
            }
        };
        fetchClients();
    }, []);

    const fetchPipeline = async () => {
        const email = localStorage.getItem('folio_user_email');
        if (!email) return;

        let query = supabase
            .from('drafts')
            .select('*')
            .eq('user_email', email)
            .order('created_at', { ascending: false });

        if (selectedClient && selectedClient.id !== 'all') {
            query = query.eq('client_id', selectedClient.id);
        }

        const { data, error } = await query;

        if (data) {
            const newCols = JSON.parse(JSON.stringify(initialColumns));
            data.forEach(post => {
                if (newCols[post.status]) {
                    newCols[post.status].items.push(post);
                }
            });
            setColumns(newCols);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedClient || clients.length === 0) {
            fetchPipeline();
        }
    }, [selectedClient]);

    const handleCreateDraft = async () => {
        const email = localStorage.getItem('folio_user_email');
        if (!email) return;

        const payload = {
            user_email: email,
            content: "New Draft Idea...",
            status: "draft",
            client_id: selectedClient && selectedClient.id !== 'all' ? selectedClient.id : null
        };

        const { error } = await supabase.from('drafts').insert(payload);
        if (!error) {
            fetchPipeline();
            addToast("Draft created", "success");
        }
    };

    const isEmpty = Object.values(columns).reduce((acc, col: any) => acc + col.items.length, 0) === 0;

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Optimistic UI Update Let's Move the Item Before Network Returns
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];

            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });

            let updatePayload: any = { status: destination.droppableId };

            if (destination.droppableId === 'scheduled') {
                const isDate = window.prompt("Schedule Post (YYYY-MM-DD):", new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                if (isDate) {
                    updatePayload.scheduled_at = new Date(isDate).toISOString();
                } else {
                    updatePayload.scheduled_at = new Date(Date.now() + 86400000).toISOString();
                }
                addToast("Post successfully scheduled.", "success");
            }

            // Async database update executing silently
            await supabase
                .from('drafts')
                .update(updatePayload)
                .eq('id', draggableId);

        } else {
            // Simple Re-Ordering within lane
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems },
            });
        }
    };


    return (
        <Layout title="Content Pipeline">
            <div className="flex justify-between items-center mb-6">
                <div className="text-h4">Content Pipeline</div>
                {clients.length > 0 && selectedClient && (
                    <Select
                        className="w-48 ml-auto mr-4"
                        items={clients}
                        value={selectedClient}
                        onChange={setSelectedClient}
                    />
                )}
                <button className="btn-purple h-12 px-6" onClick={handleCreateDraft}>
                    <Icon name="plus" />
                    <span>Create Draft</span>
                </button>
            </div>

            <div className="2xl:-mx-8 lg:-mx-6 md:-mx-5">
                {loading ? (
                    <div className="card text-center py-20 flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
                        <div className="text-h4 mb-2 text-secondary animate-pulse">Scanning Content Pipeline...</div>
                    </div>
                ) : isEmpty ? (
                    <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                        <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="tasks" />
                        <div className="text-h4 mb-2">Your pipeline is empty</div>
                        <div className="text-secondary mb-6 max-w-md mx-auto">
                            No content tasks scheduled. Start moving ideas to drafts, or generate a new weekly content pack for your clients.
                        </div>
                        <button className="btn-purple btn-shadow h-12 px-6" onClick={handleCreateDraft}>
                            <Icon name="plus" />
                            <span>Create Draft</span>
                        </button>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex overflow-auto scrollbar-none scroll-smooth 2xl:before:w-8 2xl:before:shrink-0 2xl:after:w-8 2xl:after:shrink-0 lg:before:w-6 lg:after:w-6 md:before:w-5 md:after:w-5">
                            {Object.entries(columns).map(([columnId, column], index) => (
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            className="flex flex-col min-w-[20.2rem] mr-5 pt-2 last:mr-0 lg:min-w-[19.3rem]"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <div className="flex justify-between mb-4 md:mb-2">
                                                <div className="flex items-center shrink-0">
                                                    <div className="w-2 h-2 mr-3.5" style={{ backgroundColor: column.color }}></div>
                                                    <div className="text-h4">
                                                        {column.title} ({column.items.length})
                                                    </div>
                                                </div>
                                                <button className="btn-stroke btn-square btn-small shrink-0 ml-3">
                                                    <Icon name="dots" />
                                                </button>
                                            </div>
                                            {column.items.map((item: any, index: number) => (
                                                <TaskCard key={item.id} item={item} index={index} />
                                            ))}
                                            {provided.placeholder}
                                            <button className="flex justify-center flex-row gap-2 items-center h-13 mt-3 border border-dashed border-n-1 text-xs font-bold transition-colors dark:border-white hover:!border-purple-1 hover:text-purple-1" onClick={handleCreateDraft}>
                                                <Icon className="icon-16 dark:fill-white" name="plus-circle" />
                                                Add a Draft
                                            </button>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                )}
            </div>
        </Layout>
    );
};

export default KanbanDescPage;
