import { PLANS, PlanTier } from "./plans";

interface UsageCounts {
    currentClients: number;
    currentDraftsThisMonth: number;
    currentAssets?: number;
    currentPerformanceEntries?: number;
}

export function getEntitlements(plan: PlanTier, usage: UsageCounts) {
    const limits = PLANS[plan];

    return {
        canCreateClient: usage.currentClients < limits.maxClients,
        canCreateDraft: usage.currentDraftsThisMonth < limits.maxDraftsPerMonth,
        canUploadAsset: (usage.currentAssets || 0) < limits.maxAssetsPerClient,
        canLogPerformance: (usage.currentPerformanceEntries || 0) < limits.maxPerformanceEntries,
        canViewAnalytics: limits.analytics,
        canSendForApproval: limits.approvals,
        limits,
    };
}
