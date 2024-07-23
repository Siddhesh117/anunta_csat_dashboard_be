import { Request, Response } from 'express';
import * as dashboardService from './dashboard.sevice';
import HttpCode from '../../constants/HttpCode';
import HttpSuccessMessage from '../../constants/HttpSuccessMessage';
import General from '../../utils/General';
import { ErrorHandler } from '../../utils/ErrorHandling';
import { DefaultPagination } from '../../constants/Pagination';

export const getDashboardData = General.errorHandlerFn(async (req: Request, res: Response) => {
    try {
        const client = (req.query.client || null) as string | null;
        const location = (req.query.location || null) as string | null;
        const deliveryGroup = (req.query.deliveryGroup || null) as string | null;

        const unsatisfiedNUsers = (req?.query?.unsatisfiedNUsers || null) as number | null;
        const fromDate = (req.query.fromDate || null) as string | null;
        const toDate = (req.query.toDate || null) as string | null;

        const result = await dashboardService.getDashboardData({
            client,
            location,
            deliveryGroup,
            unsatisfiedNUsers,
            fromDate,
            toDate
        });

        return res.status(HttpCode.OK).json({
            message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
            data: result
        });
    } catch (error: unknown) {
        return ErrorHandler.commonErrorHandler(error, res);
    }
});

export const getClientList = General.errorHandlerFn(async (req: Request, res: Response) => {
    try {
        const result = await dashboardService.getClientList();

        return res.status(HttpCode.OK).json({
            message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
            data: result
        });
    } catch (error: unknown) {
        return ErrorHandler.commonErrorHandler(error, res);
    }
});

export const getUsersList = General.errorHandlerFn(async (req: Request, res: Response) => {
    try {
        const result = await dashboardService.getUsersList();

        return res.status(HttpCode.OK).json({
            message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
            data: result
        });
    } catch (error: unknown) {
        return ErrorHandler.commonErrorHandler(error, res);
    }
});

export const getLocationList = General.errorHandlerFn(async (req: Request, res: Response) => {
    try {
        const result = await dashboardService.getLocationList();

        return res.status(HttpCode.OK).json({
            message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
            data: result
        });
    } catch (error: unknown) {
        return ErrorHandler.commonErrorHandler(error, res);
    }
});

export const getDeliveryGroupList = General.errorHandlerFn(async (req: Request, res: Response) => {
    try {
        const result = await dashboardService.getDeliveryGroupList();

        return res.status(HttpCode.OK).json({
            message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
            data: result
        });
    } catch (error: unknown) {
        return ErrorHandler.commonErrorHandler(error, res);
    }
});

export const getSelectedGraphRecordList = General.errorHandlerFn(
    async (req: Request, res: Response) => {
        try {
            const client = (req.query.client || null) as string | null;
            const users = (req.query.users || null) as string | null;
            const searchValue = (req.query.searchValue || null) as string | null;
            const location = (req.query.location || null) as string | null;
            const deliveryGroup = (req.query.deliveryGroup || null) as string | null;
            const userFeedback = (req.query.userFeedback || null) as string | null;
            const actionStatus = (req.query.actionStatus || null) as string | null;
            const userName = (req.query.userName || null) as string | null;

            const fromDate = (req.query.fromDate || null) as string | null;
            const toDate = (req.query.toDate || null) as string | null;

            const page = req.query.page as string;
            const pageSize = req.query.pageSize as string;

            console.log('client', client);

            const result = await dashboardService.getSelectedGraphRecordList({
                client,
                location,
                deliveryGroup,
                userFeedback,
                actionStatus,
                userName,
                users,
                searchValue,
                fromDate,
                toDate,
                page: page ? +page : DefaultPagination.PAGE,
                pageSize: pageSize ? +pageSize : DefaultPagination.PAGE_SIZE
            });

            return res.status(HttpCode.OK).json({
                message: HttpSuccessMessage.GET_ALL_DATA_STATASTICS,
                data: result
            });
        } catch (error: unknown) {
            return ErrorHandler.commonErrorHandler(error, res);
        }
    }
);
