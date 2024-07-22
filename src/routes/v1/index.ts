import { Request, Response, Router } from 'express';
import dashboardRouter from '../../api/dashboard/dashboard.router';
import HttpErrorMessage from '../../constants/HttpErrorMessage';

const router = Router();

router.use('/dashboard', dashboardRouter);

/* route to check the status of the server */
router.get('/', (req: Request, res: Response) => {
    res.send('SSM API is running!');
});

/* route to handle exception urls */
router.use((req, res) => {
    const error = new Error(HttpErrorMessage.API_ENDPOINT_NOT_FOUND);
    res.status(404).json({
        message: error.message
    });
});

export default router;
