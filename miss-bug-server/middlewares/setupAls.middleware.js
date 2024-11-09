import { authService } from '../api/auth/auth.service.js'
import { asyncLocalStorage } from '../services/als.service.js'


export async function setupAsyncLocalStorage(req, res, next) {
	const storage = {}
    
	asyncLocalStorage.run(storage, () => {
        if (!req.cookies?.loginToken) {
            // console.log('No login token found in cookies'); // Log missing token
            return next();
        }
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        console.log('Incoming Cookies:', req.cookies);

		if (loggedinUser) {
			const alsStore = asyncLocalStorage.getStore()
			alsStore.loggedinUser = loggedinUser
            console.log('Logged-in user stored:', loggedinUser); // Log the stored user
		} else {
            console.log('Invalid or expired login token'); // Log invalid token
        }
		next()
	})
}
