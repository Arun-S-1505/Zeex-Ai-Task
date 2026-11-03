export interface AnalyticsFilter {
    siteId?: string;
    contractorId?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
    detectionId?: string;
}
export declare class AnalyticsService {
    getOverview(filter?: AnalyticsFilter): Promise<{
        metrics: {
            totalAlerts: {
                value: number;
                change: string;
                detail: string;
            };
            criticalIncidents: {
                value: number;
                change: string;
                detail: string;
            };
            safetyCompliance: {
                value: string;
                change: string;
                detail: string;
            };
            avgClosureTime: {
                value: string;
                change: string;
                detail: string;
            };
        };
        cameraHealth: {
            total: number;
            online: number;
            availability: number;
        };
        closureRate: number;
        riskDistribution: {
            category: string;
            percentage: number;
            count: number;
        }[];
        topRiskLocations: {
            location: string;
            openAlerts: number;
            compliance: string;
            trend: string;
        }[];
        dailyTrends: number[];
    }>;
    getExecutiveSummary(filter?: AnalyticsFilter): Promise<{
        executiveKeyHighlights: string[];
        metrics: {
            totalAlerts: {
                value: number;
                change: string;
                detail: string;
            };
            criticalIncidents: {
                value: number;
                change: string;
                detail: string;
            };
            safetyCompliance: {
                value: string;
                change: string;
                detail: string;
            };
            avgClosureTime: {
                value: string;
                change: string;
                detail: string;
            };
        };
        cameraHealth: {
            total: number;
            online: number;
            availability: number;
        };
        closureRate: number;
        riskDistribution: {
            category: string;
            percentage: number;
            count: number;
        }[];
        topRiskLocations: {
            location: string;
            openAlerts: number;
            compliance: string;
            trend: string;
        }[];
        dailyTrends: number[];
        period: string;
        generatedAt: Date;
        portfolioStatus: string;
    }>;
    getPpeCompliance(filter?: AnalyticsFilter): Promise<{
        metrics: {
            overallCompliance: {
                value: string;
                change: string;
                detail: string;
            };
            peopleAssessed: {
                value: string;
                change: string;
                detail: string;
            };
            openViolations: {
                value: number;
                change: string;
                detail: string;
            };
            unassessable: {
                value: string;
                change: string;
                detail: string;
            };
        };
        itemWiseCompliance: {
            item: string;
            compliance: string;
            target: string;
        }[];
        complianceTrends: number[];
        topRiskLocations: {
            location: string;
            openAlerts: number;
            compliance: string;
            trend: string;
        }[];
    }>;
    getContractorAnalytics(filter?: AnalyticsFilter): Promise<{
        metrics: {
            contractorsAssessed: {
                value: string;
                detail: string;
            };
            avgViolations: {
                value: string;
                change: string;
                detail: string;
            };
            attributionConfidence: {
                value: string;
                change: string;
                detail: string;
            };
            disputesPending: {
                value: string;
                detail: string;
            };
        };
        rankings: {
            rank: number;
            name: string;
            code: string;
            violationRate: string;
            complianceScore: string;
            activeWorkFronts: number;
        }[];
        performanceTrend: number[];
    }>;
    getCameraHealthAnalytics(siteId?: string): Promise<{
        totalCameras: number;
        online: number;
        stale: number;
        offline: number;
        availabilityPercentage: number;
        averageLatencyMs: number;
        averageFps: number;
        storageRetentionDays: number;
        camerasNeedingAttention: {
            id: string;
            name: string;
            status: string;
            reason: string;
        }[];
    }>;
    getAlertAnalytics(filter?: AnalyticsFilter): Promise<{
        totalAlerts: number;
        eligibleAlerts: number;
        closedAlerts: number;
        falsePositives: number;
        closureRate: string;
        falsePositiveRate: string;
        severityBreakdown: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        monthlyTrend: number[];
    }>;
    getActivityAnalytics(activityType: string): Promise<{
        activity: string;
        activeWorkFronts: number;
        totalWorkersAssessed: number;
        incidentCount: number;
        nearMissCount: number;
        complianceRate: string;
        monitoredPermits: {
            permitId: string;
            status: string;
            contractor: string;
            validTill: string;
        }[];
        recentViolations: {
            detection: string;
            title: string;
            time: string;
            severity: string;
        }[];
    }>;
}
export declare const analyticsService: AnalyticsService;
//# sourceMappingURL=analytics.service.d.ts.map