import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'


import { userService } from '../user/userService.js';
import { loggerService } from '../../services/logger.service.js'


const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')


export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}




function getLoginToken(user) {
    const userInfo = { 
        _id: user._id, 
        username: user.username,
        fullname: user.fullname, 
        score: user.score,
        isAdmin: user.isAdmin,
    }
	return cryptr.encrypt(JSON.stringify(userInfo))

}


function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        loggedinUser
        console.log('Token validated, user:', loggedinUser); // Log valid token
        return loggedinUser
        
    } catch (err) {
        console.log('Invalid login token:', err.message); // Log error details
    }
    return null
}


async function login(username, password) {
	loggerService.debug(`auth.service - login with username: ${username}`)


	const user = await userService.getByUsername(username)

    if (!user) return Promise.reject('Invalid username or password')

    delete user.password
	user._id = user._id.toString()
	return user

}


async function signup({ username, password, fullname, imgUrl, isAdmin }) {
    const saltRounds = 10
    console.log("Received signup request"); // Add this

    loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)

	if (!username || !password || !fullname) return Promise.reject('Missing required signup information')


        const userExist = await userService.getByUsername(username)
        if (userExist) return Promise.reject('Username already taken')
    
    
        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ username, password: hash, fullname, imgUrl, isAdmin }); // Use add instead of save

    }
    
    
    
