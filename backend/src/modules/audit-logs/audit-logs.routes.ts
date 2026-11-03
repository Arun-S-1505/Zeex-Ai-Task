import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { NotFoundError } from '../../utils/errors.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = getPaginationParams(req.query);
    const entityType = req.query.entityType as string | undefined;
    const action = req.query.action as string | undefined;
    const userId = req.query.userId as string | undefined;

    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (userId) where.userId = userId;

    if (params.search) {
      where.OR = [
        { action: { contains: params.search, mode: 'insensitive' } },
        { entityType: { contains: params.search, mode: 'insensitive' } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        },
      }),
    ]);

    return sendPaginated(res, logs, total, params.page, params.limit, 'Audit logs retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await prisma.auditLog.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
    });
    if (!log) throw new NotFoundError('Audit log entry');
    return sendSuccess(res, log, 'Audit log detail');
  } catch (error) {
    next(error);
  }
});

export default router;
