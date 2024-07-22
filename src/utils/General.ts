import moment from 'moment-timezone';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CustomError, ErrorHandler } from './ErrorHandling';
import HttpCode from '../constants/HttpCode';
import HttpErrorMessage from '../constants/HttpErrorMessage';

/* common application wide utility functions are placed here. */
class General {
    /* used in created_at and updated_at. */
    public static getDate = () => {
        /* get current date, which is utc date and convert to JS Date object */
        return moment().utc().add('+5:30').toDate();
    };

    /* used in incidents */
    public static incidentDate = () => {
        const currentDate = General.getDate();
        return moment(currentDate).format('YYYYMMDD');
    };

    /* used in reports [controller] if a particular date is not present. */
    public static getYMDTHMSZDateFormat = () => {
        return moment().utcOffset('+05:30').format('YYYY-MM-DD');
    };

    /* used in pesc dashboard */
    public static getYMDFormatByDate = (date: string) => {
        return moment(date).format('YYYY-MM-DD');
    };

    public static getOtpExpiryTime = () => {
        /* get current date, which is utc date and convert to JS Date object */
        const currentDate = General.getDate();
        /* add 5 minutes to the current date */
        const otpExpiryTime = moment(currentDate).add(1, 'minute').toDate();

        return otpExpiryTime;
    };

    /* date string should not have Z (zone) in it. */
    public static addISTToDate = (date: string) => {
        return moment(date).add('+5:30');
    };

    public static isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    public static parseIp = (req: Request) => {
        const ipHeader = req.headers['x-forwarded-for'] as string;
        return ipHeader?.split(',').shift() ?? req.socket?.remoteAddress;
    };

    public static maskData = (name: string | null | undefined) => {
        if (name && name?.length >= 3) {
            const nameArr = name.split('');
            return nameArr[0] + nameArr[1] + 'XXX' + nameArr[nameArr.length - 1];
        }

        if (name && name?.length === 2) {
            const nameArr = name.split('');
            return nameArr[0] + 'XXX';
        }

        if (name && name?.length === 1) {
            return 'XXX';
        }

        return null;
    };

    public static checkIsUserExpired = (expiryDate: string) => {
        /* we remove the Z (zone) from the date string. */
        const userExpiryDate = moment(expiryDate.slice(0, -1));

        return userExpiryDate < moment();
    };

    /* method to generate a uuid-v4 pseudo-random string. Can be used in various places for uniquely identifying items. */
    public static getUUIDV4 = () => {
        return uuidv4();
    };

    /* error handler fn to catch errors in controllers. */
    public static errorHandlerFn = (fn: any) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                ErrorHandler.commonErrorHandler(error, res);
            }
        };
    };
}

export default General;
