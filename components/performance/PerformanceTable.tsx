export default function PerformanceTable({ entries }: { entries: any[] }) {
    return (
        <div className="card shadow-primary-4 overflow-hidden mt-6">
            <table className="table-custom w-full">
                <thead>
                    <tr>
                        <th className="th-custom text-left">Date</th>
                        <th className="th-custom text-right">Impressions</th>
                        <th className="th-custom text-right">Comments</th>
                        <th className="th-custom text-right">Meetings</th>
                    </tr>
                </thead>
                <tbody>
                    {(!entries || entries.length === 0) ? (
                        <tr>
                            <td colSpan={4} className="td-custom text-center py-8 text-secondary">
                                No performance data yet for this client
                            </td>
                        </tr>
                    ) : (
                        entries.map((item) => (
                            <tr key={item.id} className="border-t border-n-1 dark:border-white/10 hover:bg-n-1/50 dark:hover:bg-white/5 transition-colors">
                                <td className="td-custom text-left font-medium">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                    {item.impressions?.toLocaleString() || 0}
                                </td>
                                <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                    {item.comments?.toLocaleString() || 0}
                                </td>
                                <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                    {item.meetings?.toLocaleString() || 0}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
