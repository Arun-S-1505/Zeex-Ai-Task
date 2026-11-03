export type EventTopic = 'frame.meta' | 'detection.raw' | 'track.update' | 'rule.candidate' | 'alert.raised' | 'alert.updated' | 'evidence.ready' | 'camera.health' | 'system.health' | 'audit.entry';
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
declare class InMemoryEventBus implements IEventBus {
    private emitter;
    constructor();
    publish<T>(topic: EventTopic, payload: T): Promise<void>;
    subscribe<T>(topic: EventTopic, handler: (payload: T) => Promise<void> | void): void;
}
export declare const eventBus: InMemoryEventBus;
export default eventBus;
//# sourceMappingURL=eventBus.d.ts.map