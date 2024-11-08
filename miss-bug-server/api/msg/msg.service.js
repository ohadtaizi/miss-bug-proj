import { ObjectId } from 'mongodb'


import { asyncLocalStorage } from '../../services/als.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'


export const msgService = { query, remove, add }


async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('msg')
        
		var msgs = await collection.aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user', 
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            {
                $unwind: '$byUser',
            },
            {
                $lookup: {
                    from: 'user', foreignField: '_id',
                    localField: 'aboutUserId',
                    as: 'aboutUser',
                },
            },
            {
                $unwind: '$aboutUser',
            },
            { 
                $project: {
                    'txt': true, 
                    'byUser._id': true, 'byUser.fullname': true,
                    'aboutUser._id': true, 'aboutUser.fullname': true,
                } 
            }
        ]).toArray()


        // var msgs = await collection.find(criteria).toArray()


		// msgs = msgs.map(msg => {
		// 	msg.byUser = { 
        //         _id: msg.byUser._id, 
        //         fullname: msg.byUser.fullname 
        //     }
		// 	msg.aboutUser = { 
        //         _id: msg.aboutUser._id, 
        //         fullname: msg.aboutUser.fullname 
        //     }
		// 	delete msg.byUserId
		// 	delete msg.aboutUserId
		// 	return msg
		// })


		return msgs
	} catch (err) {
		loggerService.error('cannot get msgs', err)
		throw err
	}
}


async function remove(msgId) {
	try {
		const { loggedinUser } = asyncLocalStorage.getStore()
		const collection = await dbService.getCollection('msg')


		const criteria = { _id: ObjectId.createFromHexString(msgId) }


        // remove only if user is owner/admin
		if (!loggedinUser.isAdmin) {
            criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        }


        const { deletedCount } = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		loggerService.error(`cannot remove msg ${msgId}`, err)
		throw err
	}
}


async function add(msg) {
    try {
        const msgToAdd = {
            byUserId: ObjectId.createFromHexString(msg.byUserId),
			aboutUserId: ObjectId.createFromHexString(msg.aboutUserId),
			txt: msg.txt,
		}
		const collection = await dbService.getCollection('msg')
		await collection.insertOne(msgToAdd)
        
		return msgToAdd
	} catch (err) {
		loggerService.error('cannot add msg', err)
		throw err
	}
}


function _buildCriteria(filterBy) {
	const criteria = {}


	if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
	return criteria
}
