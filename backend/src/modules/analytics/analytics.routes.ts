import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Executive
router.get('/overview', (req, res, next) => analyticsController.getOverview(req, res, next));
router.get('/executive-summary', (req, res, next) => analyticsController.getExecutiveSummary(req, res, next));

// PPE
router.get('/ppe-compliance', (req, res, next) => analyticsController.getPpeCompliance(req, res, next));
router.get('/ppe-compliance/trends', (req, res, next) => analyticsController.getPpeCompliance(req, res, next));
router.get('/ppe-compliance/locations', (req, res, next) => analyticsController.getPpeCompliance(req, res, next));

// Contractors
router.get('/contractors', (req, res, next) => analyticsController.getContractorAnalytics(req, res, next));
router.get('/contractors/rankings', (req, res, next) => analyticsController.getContractorAnalytics(req, res, next));
router.get('/contractors/trends', (req, res, next) => analyticsController.getContractorAnalytics(req, res, next));

// Health
router.get('/camera-health', (req, res, next) => analyticsController.getCameraHealth(req, res, next));
router.get('/system-health', (req, res, next) => analyticsController.getCameraHealth(req, res, next));

// Alerts
router.get('/alerts', (req, res, next) => analyticsController.getAlertAnalytics(req, res, next));
router.get('/alerts/trends', (req, res, next) => analyticsController.getAlertAnalytics(req, res, next));
router.get('/alerts/severity', (req, res, next) => analyticsController.getAlertAnalytics(req, res, next));
router.get('/alerts/closure-rate', (req, res, next) => analyticsController.getAlertAnalytics(req, res, next));

// Activities
router.get('/activities/:activityType', (req, res, next) => analyticsController.getActivityAnalytics(req, res, next));

export default router;
