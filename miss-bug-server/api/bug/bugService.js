// import { utilService } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"
import{dbService}from "../../services/db.service.js"
import { asyncLocalStorage } from '../../services/als.service.js'
import fs from 'fs'
export const bugService = {
    query,
    getById,
    remove,
    update,
    parseBugFields,
    addBugMsg,
    removeBugMsg,
    add
}
const PAGE_SIZE = 2
// const bugs = utilService.readJsonFile('./data/bug.json')

async function query(filterBy = { txt: '' }) {
    // var filterBugs = [...bugs]
   

    try {

        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)
    
    
        const collection = await dbService.getCollection('bug')
        var bugCursor = await collection.find(criteria, { sort })
    
        if (filterBy.pageIdx !== undefined) {
			carCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		}

  


        const bugs = bugCursor.toArray()
        return bugs
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bugs...`
    }
}

async function update(bug) {
    const bugToSave = { title: bug.title, severity: bug.severity }


    try {
        const criteria = { _id: ObjectId.createFromHexString(bug._id) }


		const collection = await dbService.getCollection('bug')
		await collection.updateOne(criteria, { $set: bugToSave })


		return car
	} catch (err) {
		loggerService.error(`cannot update bug ${bug._id}`, err)
		throw err
	}
}


async function getById(bugId) {
    try {

        const criteria = { _id: ObjectId.createFromHexString(bugId) }


		const collection = await dbService.getCollection('bug')
		const bug = await collection.findOne(criteria)
        
		bug.createdAt = bug._id.getTimestamp()

        // const bug = bugs.find(bug => bug._id === bugId)
        // if (!bug) throw `Couldn't get bug...`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bug...`
    }
}

async function remove(bugId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerId, isAdmin } = loggedinUser

    try {
        const criteria = { 
            _id: ObjectId.createFromHexString(carId), 
        }

        if(!isAdmin) criteria['owner._id'] = ownerId
        
		const collection = await dbService.getCollection('bug')
		const res = await collection.deleteOne(criteria)


        if(res.deletedCount === 0) throw('Not your bug')
		return bugId


    } catch (err) {
        loggerService.error(err)
        throw `Couldn't remove bug`
    }
}
async function add(bug) {
	try {
        
		const collection = await dbService.getCollection('bug')
		await collection.insertOne(bug)


		return bug
	} catch (err) {
		loggerService.error('cannot insert bug', err)
		throw err
	}
}

// async function save(bugToSave, user) {
//     const fieldsToUpdate = parseBugFields(bugToSave)
//     try {
//         const idx = bugs.findIndex(bug => bug._id === bugToSave._id)

//         if (bugToSave._id) {
//             if (idx === -1) throw `Bad bug Id`
//             if (!user.isAdmin) {
//                 if (bugs[idx].owner._id !== user._id) throw `Not your bug`
//             }
//             bugToSave = { ...bugs[idx], ...fieldsToUpdate }
//             bugs.splice(idx, 1, bugToSave);
//         } else {
//             bugToSave = { ...bugs[idx], ...fieldsToUpdate }
//             bugToSave._id = utilService.makeId()
//             bugs.push(bugToSave);
//         }
//         _saveBugs()
//     } catch (err) {
//         loggerService.error(err)
//         throw `couldn't save bug`
//     }
//     await _saveBugsToFile(bugs)
//     return bugToSave
// }




async function addBugMsg(bugId, msg) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        msg.id = makeId()
        
		const collection = await dbService.getCollection('bug')
		await collection.updateOne(criteria, { $push: { msgs: msg } })
0
    return msg
    } catch (err) {
        loggerService.error(`cannot add bug msg ${bugId}`, err)
    throw err
    }
    }

    async function removeBugMsg(bugId, msgid) {
        try{
            const criteria = { _id: ObjectId.createFromHexString(bugId) }
            msg.id = makeId()
            
            const collection = await dbService.getCollection('bug')
            await collection.updateOne(criteria, { $push: { msgs: msg } })
    
            return msgid;
        }catch{
            loggerService.error(`cannot remove bug msg ${bugId}`, err)
            throw err
    
        }

    }

// async function _saveBugs() {
//     utilService.writeJsonFile('./data/bug.json', bugs)
// }
function parseBugFields(bug) {
    // Peek only allwoed to update or add fields
    return {
        title: bug.title || '',
        description: bug.description || '',
        severity: bug.severity || 0,
        labels: bug.labels || [],
        createdAt: bug.createdAt || Date.now(),
        owner: bug.owner || {},
        _id: bug._id || utilService.makeId(),
    }
}
// function _saveBugsToFile(data) {
//     console.log(data)
//     return new Promise((resolve, reject) => {
//         // Ensure data is a string before saving to file
//         const jsonData = JSON.stringify(data, null, 2) // format with indentation
//         const path = './data/bug.json'
        
//         fs.writeFile(path, jsonData, (err) => {
//             if (err) return reject(err)
//             resolve()
//         })
//     })
// }
function _buildCriteria(filterBy) {
    const criteria = {};

    // Text filter
    if (filterBy.txt) {
        criteria.title = { $regex: filterBy.txt, $options: 'i' };
    }

    // Severity filter
    if (filterBy.severity !== undefined) {
        criteria.severity = { $gte: filterBy.severity };
    }

    // Labels filter (checks if bug's labels array contains any specified labels)
    if (filterBy.labels) {
        const labels = filterBy.labels.split(',');
        criteria.labels = { $in: labels };
    }

    return criteria;
}


function _buildSort(filterBy) {
    if(!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}
