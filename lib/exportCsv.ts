export function exportPerformanceCSV(entries: any[], clientName: string) {
    if (!entries || entries.length === 0) return;

    const hasDrafts = entries.some(e => e.draft_id);
    const headers = ["Date", "Impressions", "Comments", "Meetings"];
    if (hasDrafts) headers.push("Post Title");

    const rows = entries.map(item => {
        const date = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown';
        let row = `"${date}",${item.impressions || 0},${item.comments || 0},${item.meetings || 0}`;

        if (hasDrafts) {
            const title = item.drafts?.title || item.draft?.title || "";
            const safeTitle = title.replace(/"/g, '""');
            row += `,"${safeTitle}"`;
        }

        return row;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);

    const safeClientName = clientName ? clientName.replace(/\s+/g, '-') : "Unknown-Client";
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `performance-report-${safeClientName}-${dateStr}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
