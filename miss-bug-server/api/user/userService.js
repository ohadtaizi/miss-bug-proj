import { loggerService } from '../../services/logger.service.js';
import { dbService } from '../../services/db.service.js'
import { msgService } from '../msg/msg.service.js';
// const users = utilService.readJsonFile('data/user.json')


export const userService = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername
}


async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)

    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()

        users= users.map(user=>{
            delete user.password
            user.createdAt = user._id.getTimestamp()
            return user

        })
        return users
    }
    catch {
        loggerService.error('canot find users: ', err)
        throw err
    }
}


async function getById(userId) {

    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        delete user.password

        criteria = { byUserId: userId }


        user.givenmsgs = await msgService.query(criteria)
        user.givenmsgs = user.msgService.map(msg => {
            delete nsg.byUser
            return msg
        })

        return user
    } catch (err) {
        loggerService.error('Failed to get Mongo collection', err);

        throw err
    }
}


async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username: username })

        return user
    } catch (err) {
        loggerService.error(`while finding user by username: ${username}`, err)   
             throw err
    }
}


async function remove(userId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection('user')
         await collection.deletOne(criteria)
    } catch (err) {
        loggerService.error('userService[remove] : ', err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin,
            score: 100,
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd


    } catch (err) {
        loggerService.error('cannot add user', err)
        throw err


    }

}
async function update(user) {
    try{
    const userToSave = {
        _id:ObjectId.createFromHexString(user._id),
        fullname: user.fullname,
        score: user.score,
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
}
catch{
    loggerService.error(`cannot update user ${user._id}`, err)
            throw err
}

}

// async function save(user) {
//     // Only handles user ADD for now
//     try {
//         user._id = utilService.makeId()
//         user.score = 10000
//         user.createdAt = Date.now()
//         if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

//         users.push(user)

//         await _saveUsersToFile()
//         return user
//     } catch (err) {
//         loggerService.error('userService[save] : ', err)
//         throw err
//     }
// }


// function _saveUsersToFile() {
//     return utilService.writeJsonFile('data/user.json', users)
// }
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}
