import { utilService } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"
import fs from 'fs'
export const bugService = {
    query,
    getById,
    remove,
    save,
    parseBugFields
}
const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('./data/bug.json')

async function query(filterBy = {}) {
    var filterBugs = [...bugs]
    try {
        if (filterBy.sortBy === 'title') {
            filterBugs = filterBugs.filter(bug => bug.title && bug.title.trim() !== '');
        }


        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            filterBugs = bugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.severity) {
            filterBugs = bugs.filter(bug => bug.severity >= filterBy.severity)
        }
        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filterBugs = filterBugs.slice(startIdx, startIdx + PAGE_SIZE)
        }

        if (filterBy.labels) {
            const labels = filterBy.labels.split(',');
            // filterBugs = filterBugs.filter(bug => bug.labels.some(label => labels.includes(label)));
            filterBugs = filterBugs.filter(bug => bug.labels && bug.labels.some(label => labels.includes(label)));

            console.log('labels', labels)
        }

        // Sorting logic
        if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === '-1' ? -1 : 1;
            filterBugs.sort((a, b) => {
                if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * sortDir;
                if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * sortDir;
                return 0;
            });
        }



        return filterBugs
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bugs...`
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't get bug...`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bug...`
    }
}

async function remove(bugId, user) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Bad bug Id`
        if (!user.isAdmin) {
            if (bugs[idx].owner._id !== user._id) throw `Not your bug`
        }
        bugs.splice(idx, 1)
        _saveBugs()
        await _saveBugsToFile(bugs)

    } catch (err) {
        loggerService.error(err)
        throw `Couldn't remove bug`
    }
}

async function save(bugToSave, user) {
    const fieldsToUpdate = parseBugFields(bugToSave)
    try {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)

        if (bugToSave._id) {
            if (idx === -1) throw `Bad bug Id`
            if (!user.isAdmin) {
                if (bugs[idx].owner._id !== user._id) throw `Not your bug`
            }
            bugToSave = { ...bugs[idx], ...fieldsToUpdate }
            bugs.splice(idx, 1, bugToSave);
        } else {
            bugToSave = { ...bugs[idx], ...fieldsToUpdate }
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave);
        }
        _saveBugs()
    } catch (err) {
        loggerService.error(err)
        throw `couldn't save bug`
    }
    await _saveBugsToFile(bugs)
    return bugToSave
}

async function _saveBugs() {
    utilService.writeJsonFile('./data/bug.json', bugs)
}
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
function _saveBugsToFile(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
        // Ensure data is a string before saving to file
        const jsonData = JSON.stringify(data, null, 2) // format with indentation
        const path = './data/bug.json'
        
        fs.writeFile(path, jsonData, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
