import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
export interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        email: string;
        role: string;
        siteId: string | null;
    };
}
export declare function initSocketIO(server: HttpServer): SocketIOServer;
export declare function getIO(): SocketIOServer;
export declare function emitNewAlert(alert: any): void;
export declare function emitAlertUpdated(alert: any): void;
export declare function emitAlertAcknowledged(alert: any): void;
export declare function emitAlertAssigned(alert: any): void;
export declare function emitAlertClosed(alert: any): void;
export declare function emitCameraStatusChanged(camera: any): void;
export declare function emitSystemHealthUpdated(healthData: any): void;
export declare function emitNotification(recipientId: string, notification: any): void;
export declare function emitEvidenceReady(evidence: any): void;
//# sourceMappingURL=index.d.ts.map