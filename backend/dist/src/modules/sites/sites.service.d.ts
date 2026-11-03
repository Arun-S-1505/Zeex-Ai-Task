import { CreateSiteInput, UpdateSiteInput } from './sites.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class SitesService {
    list(params: PaginationParams): Promise<{
        total: number;
        sites: ({
            _count: {
                zones: number;
                cameras: number;
                workFronts: number;
                alerts: number;
            };
        } & {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            timezone: string;
        })[];
    }>;
    getById(id: string): Promise<{
        _count: {
            zones: number;
            cameras: number;
            alerts: number;
        };
        zones: {
            code: string;
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            zoneType: string;
            polygon: import("@prisma/client/runtime/library").JsonValue | null;
            calibration: import("@prisma/client/runtime/library").JsonValue | null;
            riskLevel: string;
        }[];
        cameras: {
            status: string;
            name: string;
            id: string;
            zone: {
                name: string;
                id: string;
            } | null;
            cameraCode: string;
            recordingStatus: string;
            fps: number | null;
            lastFrameAt: Date | null;
        }[];
        workFronts: {
            code: string;
            status: string;
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            zoneId: string | null;
            activity: string | null;
            startDate: Date | null;
            endDate: Date | null;
            shiftPattern: string | null;
        }[];
    } & {
        code: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        timezone: string;
    }>;
    create(input: CreateSiteInput, actorId?: string, ipAddress?: string): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        timezone: string;
    }>;
    update(id: string, input: UpdateSiteInput, actorId?: string, ipAddress?: string): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        timezone: string;
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
}
export declare const sitesService: SitesService;
//# sourceMappingURL=sites.service.d.ts.map