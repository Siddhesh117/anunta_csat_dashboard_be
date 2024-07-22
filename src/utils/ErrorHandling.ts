import { JsonWebTokenError } from 'jsonwebtoken';
import HttpCode from '../constants/HttpCode';
import HttpErrorMessage from '../constants/HttpErrorMessage';
import { Response } from 'express';
import { ZodError, ZodIssue } from 'zod';

/* Custom error class, used to throw errors within the application */
export class CustomError extends Error {
    /* to enforce strict private #varName is used.
       if private varname:dataType is used, the variable is still accessible using below

          class Age {
            status: number;

            constructor() {
                this.status = 20;
            }

        }

        const age = new Age() as any;
        console.log(age);  [this will export the status member]

        o/p -> {status:20}
    */
    #status: number;

    public constructor(status: HttpCode, message: string) {
        super(message);
        this.#status = status;
    }

    public getErrorMessageAndStatus() {
        return {
            status: this.#status,
            message: this.message
        };
    }
}

/* Error handler class to handle all types of error */
export class ErrorHandler {
    public static zodErrorHandler(issues: ZodIssue[]) {
        let responseStr = '';
        issues.forEach((item, i) => {
            let arrayMessage = '';
            if (item.path.length > 1) {
                const arrayElement = item.path.at(0);
                const arrayErrPosition = item.path.at(1);
                arrayMessage = ` for ${arrayElement} at position ${arrayErrPosition}`;
            }
            responseStr +=
                `${item.message}` +
                arrayMessage +
                (issues.length == 1 || i == issues.length - 1 ? '.' : ', ');
        });
        return responseStr;
    }

    public static commonErrorHandler(error: unknown, res: Response) {
        try {
            if (error instanceof CustomError) {
                const errorData = error.getErrorMessageAndStatus();
                if (errorData.status) {
                    return res.status(errorData.status).json({ message: errorData.message });
                }
            } else if (error instanceof JsonWebTokenError) {
                return res.status(HttpCode.INVALID_TOKEN).json({ message: error.message });
            } else if (error instanceof ZodError) {
                const responseStr = ErrorHandler.zodErrorHandler(error.issues);
                return res.status(HttpCode.BAD_REQUEST).json({ message: responseStr });
            } else if (error instanceof Error) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else
                return res
                    .status(HttpCode.INTERNAL_SERVER_ERROR)
                    .json({ message: HttpErrorMessage.INTERNAL_SERVER_ERROR_MESSAGE });
        } catch (error) {
            return res
                .status(HttpCode.INTERNAL_SERVER_ERROR)
                .json({ message: HttpErrorMessage.INTERNAL_SERVER_ERROR_MESSAGE });
        }
    }
}
