import { Router } from 'express';
import * as dashboardController from './dashboard.controller';

const dashboardRouter = Router();

dashboardRouter.get('/', dashboardController.getDashboardData);
dashboardRouter.get('/client-list', dashboardController.getClientList);
dashboardRouter.get('/location-list', dashboardController.getLocationList);
dashboardRouter.get('/delivery-group-list', dashboardController.getDeliveryGroupList);
dashboardRouter.get('/graph-record-list', dashboardController.getSelectedGraphRecordList);


export default dashboardRouter;
