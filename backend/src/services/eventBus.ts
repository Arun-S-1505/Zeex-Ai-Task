import { EventEmitter } from 'events';
import logger from '../config/logger.js';

export type EventTopic =
  | 'frame.meta'
  | 'detection.raw'
  | 'track.update'
  | 'rule.candidate'
  | 'alert.raised'
  | 'alert.updated'
  | 'evidence.ready'
  | 'camera.health'
  | 'system.health'
  | 'audit.entry';

export interface EventBusMessage<T = any> {
  topic: EventTopic;
  eventId: string;
  timestamp: Date;
  payload: T;
}

export interface IEventBus {
  publish<T>(topic: EventTopic, payload: T): Promise<void>;
  subscribe<T>(topic: EventTopic, handler: (payload: T) => Promise<void> | void): void;
}

class InMemoryEventBus implements IEventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  async publish<T>(topic: EventTopic, payload: T): Promise<void> {
    try {
      this.emitter.emit(topic, payload);
    } catch (error) {
      logger.error({ error, topic }, 'Failed to publish event to bus');
    }
  }

  subscribe<T>(topic: EventTopic, handler: (payload: T) => Promise<void> | void): void {
    this.emitter.on(topic, async (payload: T) => {
      try {
        await handler(payload);
      } catch (error) {
        logger.error({ error, topic }, 'Error in event subscription handler');
      }
    });
  }
}

export const eventBus = new InMemoryEventBus();
export default eventBus;
