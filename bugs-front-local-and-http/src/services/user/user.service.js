import Axios from 'axios'


var axios = Axios.create({
    withCredentials: true,
})


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3030/api/'


const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'


export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    
    getUsers,
    getById,
    remove,
    update,
    getEmptyUser
}


window.userService = userService


async function getUsers() {
    return httpService.get(`user`)
}


async function getById(userId) {
    // const { data: user } = await axios.get(BASE_USER_URL + userId)
    const user = await httpService.get(`user/${userId}`)
    return user
}


async function remove(userId) {
    // return await axios.remove(BASE_USER_URL + userId)
    return httpService.delete(`user/${userId}`)
}


async function update({ _id, score }) {
    // const user = await getById(userToUpdate.id)
    // console.log('user', user)
    // const updatedUser = await axios.put(BASE_USER_URL, userToUpdate)

    const user = await httpService.put(`user/${_id}`, { _id, score })


	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser() // Might not work because 

    if (getLoggedinUser().id === updatedUser.id) saveLocalUser(updatedUser)
    return updatedUser
}


async function login(credentials) {
    // const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    const user = await httpService.post('auth/login', credentials)
    console.log('user', user);
    if (user) {
        return saveLocalUser(user)
    }
}


async function signup(credentials) {


    // const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    // return saveLocalUser(user)
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	userCred.score = 10000


    const user = await httpService.post('auth/signup', userCred)
	return saveLocalUser(user)

}


async function logout() {
    // await axios.post(BASE_AUTH_URL + 'logout')
    // sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')

}


function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
    }
}


function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin,score: user.score }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
