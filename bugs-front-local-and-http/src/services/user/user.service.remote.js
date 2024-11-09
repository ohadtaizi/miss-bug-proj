import { storageService } from '../async-storage.service'


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


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
    getEmptyUser,
    _createAdmin

}


window.userService = userService


async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })

}


async function getById(userId) {
    return await storageService.get('user', userId)
}


function remove(userId) {
    return  storageService.remove('user', userId)
}


async function update({ _id, score }) {
    const user =  await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)
 	// When admin updates other user's details, do not update loggedinUser
     const loggedinUser = getLoggedinUser()
     if (loggedinUser._id === user._id) saveLocalUser(user)
 
}


// async function login(userCred) {
//     const users =await storageService.get('user')
//     const user = users.find(user => user.username === userCred.username)


//     if (user) return saveLocalUser(user)
// }

async function login(credentials) {
    const users = await storageService.query('user', { username: credentials.username });
    const user = users[0]; // Assuming usernames are unique
    if (!user || user.password !== credentials.password) {
        throw new Error('Invalid username or password');
    }
    return user;
}
async function signup(userCred) {
    userCred.score = 10000
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post('user', userCred)
    
    return saveLocalUser(user)
}


async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    
}


function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
        score:''
    }
}
function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


function saveLocalUser(user) {
    user = { id: user.id, fullname: user.fullname, imgUrl: user.imgUrl, score: user.score,isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}


// function getLoggedinUser() {
//     return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
// }



// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
    }


    const newUser = await storageService.post('user', userCred)
    console.log('newUser: ', newUser)
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123', isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123',  isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123'})
// })()
