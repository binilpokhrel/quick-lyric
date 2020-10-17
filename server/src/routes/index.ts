import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import SpotifyRouter from './Spotify'

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/spotify', SpotifyRouter);

// Export the base-router
export default router;
