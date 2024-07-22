import { rateLimit } from 'express-rate-limit';
import General from './General';

class RateLimiter {
    public static limiter = rateLimit({
        windowMs: 1 * 1000, // 15 minutes
        limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        keyGenerator: function (req: any) {
            return General.parseIp(req) as string;
        }
    });
}

export default RateLimiter;
