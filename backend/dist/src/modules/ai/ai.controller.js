import { aiService } from './ai.service.js';
import { sendSuccess } from '../../utils/response.js';
export class AIController {
    async handleEvent(req, res, next) {
        try {
            const result = await aiService.processEvent(req.body);
            const statusCode = result.status === 'alert_raised' ? 201 : 200;
            return sendSuccess(res, result, `AI event processed: ${result.status}`, statusCode);
        }
        catch (error) {
            next(error);
        }
    }
}
export const aiController = new AIController();
//# sourceMappingURL=ai.controller.js.map