import { ThrowableRouter, status } from 'itty-router-extras'

/**
 * Application-wide router instance
 */
const router = ThrowableRouter()

// Catch-all route for unhandled requests
router.all('*', () => status(404, 'Unknown action'))

export default router
