/* 
express requests will have a user property added after authentication
to handle type errors while assigning req.user below type is defined.
All authenticated requests should use AuthenticatedRequest type.
*/

declare namespace Express {
    interface Request {
        user?: any;
    }
}
