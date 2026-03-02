export type PlanTier = 'free' | 'starter' | 'pro';

export const PLANS: Record<PlanTier, {
    maxClients: number;
    maxDraftsPerMonth: number;
    maxAssetsPerClient: number;
    maxPerformanceEntries: number;
    analytics: boolean;
    approvals: boolean;
}> = {
    free: {
        maxClients: 1,
        maxDraftsPerMonth: 10,
        maxAssetsPerClient: 5,
        maxPerformanceEntries: 10,
        analytics: false,
        approvals: false,
    },
    starter: {
        maxClients: 3,
        maxDraftsPerMonth: 50,
        maxAssetsPerClient: Infinity,
        maxPerformanceEntries: Infinity,
        analytics: true,
        approvals: true,
    },
    pro: {
        maxClients: Infinity,
        maxDraftsPerMonth: Infinity,
        maxAssetsPerClient: Infinity,
        maxPerformanceEntries: Infinity,
        analytics: true,
        approvals: true,
    },
};
