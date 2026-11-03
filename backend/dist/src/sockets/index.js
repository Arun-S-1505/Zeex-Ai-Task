import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../config/database.js';
import logger from '../config/logger.js';
import eventBus from '../services/eventBus.js';
let io = null;
export function initSocketIO(server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true,
            methods: ['GET', 'POST'],
        },
        pingInterval: 10000,
        pingTimeout: 5000,
    });
    // Socket Auth Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return next(new Error('Authentication token required for WebSocket connection'));
            }
            const decoded = jwt.verify(token, env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId, isActive: true, deletedAt: null },
                include: { role: true },
            });
            if (!user) {
                return next(new Error('User not found or inactive'));
            }
            socket.user = {
                id: user.id,
                email: user.email,
                role: user.role.name,
                siteId: user.siteId,
            };
            next();
        }
        catch (err) {
            logger.warn({ error: err.message }, 'WebSocket authentication failed');
            next(new Error('Authentication failed'));
        }
    });
    io.on('connection', (socket) => {
        if (!socket.user)
            return;
        const { id, role, siteId } = socket.user;
        logger.info({ userId: id, role, siteId }, 'WebSocket client connected');
        // Join room for this specific user
        socket.join(`user:${id}`);
        // Join room for user's role
        socket.join(`role:${role}`);
        // Join room for user's site if assigned
        if (siteId) {
            socket.join(`site:${siteId}`);
        }
        socket.on('join_site', (targetSiteId) => {
            // Allow operators / admins to view different sites
            if (role === 'ADMIN' || role === 'MANAGEMENT' || role === 'OPERATOR') {
                socket.join(`site:${targetSiteId}`);
                logger.debug({ userId: id, targetSiteId }, 'User joined site room');
            }
        });
        socket.on('leave_site', (targetSiteId) => {
            socket.leave(`site:${targetSiteId}`);
        });
        socket.on('disconnect', (reason) => {
            logger.info({ userId: id, reason }, 'WebSocket client disconnected');
        });
    });
    // Wire internal event bus to socket broadcasts
    eventBus.subscribe('alert.raised', (payload) => {
        emitNewAlert(payload);
    });
    eventBus.subscribe('alert.updated', (payload) => {
        emitAlertUpdated(payload);
    });
    eventBus.subscribe('camera.health', (payload) => {
        emitCameraStatusChanged(payload);
    });
    eventBus.subscribe('system.health', (payload) => {
        emitSystemHealthUpdated(payload);
    });
    eventBus.subscribe('evidence.ready', (payload) => {
        emitEvidenceReady(payload);
    });
    return io;
}
export function getIO() {
    if (!io) {
        throw new Error('Socket.IO is not initialized yet');
    }
    return io;
}
// Broadcaster utility functions
export function emitNewAlert(alert) {
    if (!io)
        return;
    // Broadcast to relevant site room and operators/admins
    if (alert.siteId) {
        io.to(`site:${alert.siteId}`).emit('new_alert', alert);
    }
    io.to('role:ADMIN').to('role:OPERATOR').to('role:MANAGEMENT').emit('new_alert', alert);
}
export function emitAlertUpdated(alert) {
    if (!io)
        return;
    if (alert.siteId) {
        io.to(`site:${alert.siteId}`).emit('alert_updated', alert);
    }
    io.to('role:ADMIN').to('role:OPERATOR').to('role:MANAGEMENT').emit('alert_updated', alert);
}
export function emitAlertAcknowledged(alert) {
    if (!io)
        return;
    io.emit('alert_acknowledged', alert);
}
export function emitAlertAssigned(alert) {
    if (!io)
        return;
    io.emit('alert_assigned', alert);
    if (alert.assignedUserId) {
        io.to(`user:${alert.assignedUserId}`).emit('alert_assigned_to_me', alert);
    }
}
export function emitAlertClosed(alert) {
    if (!io)
        return;
    io.emit('alert_closed', alert);
}
export function emitCameraStatusChanged(camera) {
    if (!io)
        return;
    if (camera.siteId) {
        io.to(`site:${camera.siteId}`).emit('camera_status_changed', camera);
    }
    io.emit('camera_status_changed', camera);
}
export function emitSystemHealthUpdated(healthData) {
    if (!io)
        return;
    io.emit('system_health_updated', healthData);
}
export function emitNotification(recipientId, notification) {
    if (!io)
        return;
    io.to(`user:${recipientId}`).emit('notification_received', notification);
}
export function emitEvidenceReady(evidence) {
    if (!io)
        return;
    io.emit('evidence_ready', evidence);
}
//# sourceMappingURL=index.js.map