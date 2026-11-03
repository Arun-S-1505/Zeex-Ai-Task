export interface EvaluationInput {
    detectionCode: string;
    cameraId: string;
    siteId: string;
    zoneId?: string;
    workFrontId?: string;
    confidence: number;
    occurredAt: Date;
    trackId?: string;
}
export interface EvaluationResult {
    shouldRaiseAlert: boolean;
    isCandidate: boolean;
    reason?: string;
    detectionId: string;
    severity: string;
    confidenceThreshold: number;
    slaMinutes: number;
    ruleInstanceId?: string;
    contractorId?: string;
}
export declare class RuleEngineService {
    /**
     * Evaluate safety detection event against detection definition and active rules
     */
    evaluate(input: EvaluationInput): Promise<EvaluationResult>;
    private getSlaMinutes;
}
export declare const ruleEngine: RuleEngineService;
export default ruleEngine;
//# sourceMappingURL=ruleEngine.d.ts.map