import { CreateCameraInput, UpdateCameraInput, RelocateCameraInput, CalibrateCameraInput } from './cameras.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class CamerasService {
    list(params: PaginationParams, filters?: {
        siteId?: string;
        zoneId?: string;
        status?: string;
    }): Promise<{
        total: number;
        cameras: {
            state: string;
            people: number;
            last: string;
            activeAlertsCount: number;
            status: string;
            model: string | null;
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            site: {
                code: string;
                name: string;
                id: string;
            };
            _count: {
                alerts: number;
            };
            zoneId: string | null;
            workFrontId: string | null;
            ipAddress: string | null;
            zone: {
                code: string;
                name: string;
                id: string;
            } | null;
            workFront: {
                code: string;
                name: string;
                id: string;
            } | null;
            cameraCode: string;
            rtspUrl: string | null;
            cameraType: string;
            manufacturer: string | null;
            recordingStatus: string;
            fps: number | null;
            bitrate: number | null;
            lastFrameAt: Date | null;
            networkLatency: number | null;
            tamperingStatus: string;
            calibrationData: import("@prisma/client/runtime/library").JsonValue;
            resolution: string | null;
        }[];
    }>;
    getById(id: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
    create(input: CreateCameraInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
    update(id: string, input: UpdateCameraInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
    getHealth(id: string): Promise<{
        isHealthy: boolean;
        healthScore: number;
        lastChecked: Date;
        status: string;
        name: string;
        id: string;
        cameraCode: string;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
    }>;
    getStream(id: string): Promise<{
        cameraId: string;
        cameraCode: string;
        name: string;
        status: string;
        streamUrl: string;
        webRtcUrl: string;
        simulatedFeed: boolean;
        resolution: string;
        fps: number;
    }>;
    getHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        cameraId: string;
        zoneId: string | null;
        workFrontId: string | null;
        action: string;
        notes: string | null;
        performedBy: string | null;
        deployedAt: Date;
    }[]>;
    assignZone(id: string, zoneId: string, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
    relocate(id: string, input: RelocateCameraInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
    calibrate(id: string, input: CalibrateCameraInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        model: string | null;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        site: {
            code: string;
            name: string;
            id: string;
        };
        _count: {
            alerts: number;
        };
        zoneId: string | null;
        workFrontId: string | null;
        ipAddress: string | null;
        zone: {
            code: string;
            name: string;
            id: string;
        } | null;
        workFront: {
            code: string;
            name: string;
            id: string;
        } | null;
        cameraCode: string;
        rtspUrl: string | null;
        cameraType: string;
        manufacturer: string | null;
        recordingStatus: string;
        fps: number | null;
        bitrate: number | null;
        lastFrameAt: Date | null;
        networkLatency: number | null;
        tamperingStatus: string;
        calibrationData: import("@prisma/client/runtime/library").JsonValue;
        resolution: string | null;
    }>;
}
export declare const camerasService: CamerasService;
//# sourceMappingURL=cameras.service.d.ts.map