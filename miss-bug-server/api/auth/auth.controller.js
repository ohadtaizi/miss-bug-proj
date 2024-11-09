import { authService } from './auth.service.js'
import { loggerService } from './../../services/logger.service.js';


export async function login(req, res) {
    const { username, password } = req.body


    try {
        const user = await authService.login(username, password)
        loggerService.info('User login: ', user)
        
        const loginToken = authService.getLoginToken(user)
        console.log('loginToken',loginToken)
        res.cookie('loginToken', loginToken )
       


        res.json(user)
    } catch (err) {
        loggerService.error('Failed to Login:', err.message || err);


        res.status(401).send({ err: 'Failed to Login' })
    }
}


export async function signup(req, res) {
    try {
        const credentials = req.body


        // Never log passwords
        // loggerService.debug(credentials)
        
        const account = await authService.signup(credentials)
        loggerService.debug(`auth.route - new account created: ` + JSON.stringify(account))
        console.log("test");
        const user = await authService.login(credentials.username, credentials.password)
        loggerService.info('User signup:', user)
        
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        
        res.json(user)
    } catch (err) {
        console.log('Signup error:', err); // Log error for debugging
        res.status(400).send({ err: 'Failed to signup' })
    }
}


export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(400).send({ err: 'Failed to logout' })
    }
}
