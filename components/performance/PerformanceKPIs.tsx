interface PerformanceKPIsProps {
    entries: any[];
}

export default function PerformanceKPIs({ entries }: PerformanceKPIsProps) {
    const totalImpressions = entries.reduce((sum, item) => sum + (item.impressions || 0), 0);
    const totalComments = entries.reduce((sum, item) => sum + (item.comments || 0), 0);
    const totalMeetings = entries.reduce((sum, item) => sum + (item.meetings || 0), 0);
    const totalEntries = entries.length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                <div className="text-sm font-bold text-secondary mb-1">Total Impressions</div>
                <div className="text-h3 text-purple-1">{totalImpressions.toLocaleString()}</div>
            </div>
            <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                <div className="text-sm font-bold text-secondary mb-1">Total Comments</div>
                <div className="text-h3 text-green-1">{totalComments.toLocaleString()}</div>
            </div>
            <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                <div className="text-sm font-bold text-secondary mb-1">Total Meetings</div>
                <div className="text-h3 text-yellow-1">{totalMeetings.toLocaleString()}</div>
            </div>
            <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                <div className="text-sm font-bold text-secondary mb-1">Entries Logged</div>
                <div className="text-h3 text-blue-1">{totalEntries.toLocaleString()}</div>
            </div>
        </div>
    );
}
