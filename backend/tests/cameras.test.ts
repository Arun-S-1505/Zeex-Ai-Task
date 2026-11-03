import { describe, it, expect, vi, beforeEach } from 'vitest';
import { camerasService } from '../src/modules/cameras/cameras.service.js';
import prisma from '../src/config/database.js';

describe('Camera Management Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('list - should retrieve cameras with simulated track counts and status mapping', async () => {
    vi.spyOn(prisma.camera, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.camera, 'findMany').mockResolvedValue([
      {
        id: 'cam-uuid-1',
        cameraCode: 'CAM-042',
        name: 'Boiler House B',
        ipAddress: '192.168.1.42',
        rtspUrl: 'rtsp://stream.internal/cam042',
        cameraType: 'fixed',
        status: 'online',
        fps: 25.0,
        lastFrameAt: new Date(),
        site: { id: 'site-1', name: 'North Plant', code: 'SITE-NP' },
        zone: { id: 'zone-1', name: 'Boiler House B', code: 'ZONE-BH' },
        workFront: null,
        _count: { alerts: 3 },
      } as any,
    ]);

    const result = await camerasService.list({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.cameras[0].cameraCode).toBe('CAM-042');
    expect(result.cameras[0].state).toBe('online');
    expect(result.cameras[0]).toHaveProperty('people');
    expect(result.cameras[0]).not.toHaveProperty('rtspPassword');
  });

  it('getStream - should return streaming endpoints without exposing rtspPassword', async () => {
    vi.spyOn(prisma.camera, 'findUnique').mockResolvedValue({
      id: 'cam-uuid-1',
      cameraCode: 'CAM-042',
      name: 'Boiler House B',
      status: 'online',
      resolution: '1080p',
      fps: 25,
    } as any);

    const stream = await camerasService.getStream('cam-uuid-1');
    expect(stream.streamUrl).toContain('/api/v1/streams/live/cam-uuid-1/index.m3u8');
    expect(stream.webRtcUrl).toContain('webrtc/cam-uuid-1');
    expect(stream).not.toHaveProperty('rtspPassword');
  });

  it('getHealth - should calculate camera health score based on network telemetry', async () => {
    vi.spyOn(prisma.camera, 'findUnique').mockResolvedValue({
      id: 'cam-uuid-1',
      cameraCode: 'CAM-042',
      name: 'Boiler House B',
      status: 'online',
      recordingStatus: 'active',
      fps: 25.0,
      bitrate: 4096.0,
      lastFrameAt: new Date(),
      networkLatency: 45.0,
      tamperingStatus: 'normal',
    } as any);

    const health = await camerasService.getHealth('cam-uuid-1');
    expect(health.isHealthy).toBe(true);
    expect(health.healthScore).toBe(98);
  });
});
