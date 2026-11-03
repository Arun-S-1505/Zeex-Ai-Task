import { EventEmitter } from 'events';
import logger from '../config/logger.js';
class InMemoryEventBus {
    emitter;
    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(50);
    }
    async publish(topic, payload) {
        try {
            this.emitter.emit(topic, payload);
        }
        catch (error) {
            logger.error({ error, topic }, 'Failed to publish event to bus');
        }
    }
    subscribe(topic, handler) {
        this.emitter.on(topic, async (payload) => {
            try {
                await handler(payload);
            }
            catch (error) {
                logger.error({ error, topic }, 'Error in event subscription handler');
            }
        });
    }
}
export const eventBus = new InMemoryEventBus();
export default eventBus;
//# sourceMappingURL=eventBus.js.map