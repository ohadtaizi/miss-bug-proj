import { utilService } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
}
const PAGE_SIZE=2
const bugs = utilService.readJsonFile('./data/bug.json')

async function query(filterBy = {}) {
    var filterBugs=[...bugs]
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

          // Sorting logic
          if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === '-1' ? -1 : 1;
            filterBugs.sort((a, b) => {
                if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * sortDir;
                if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * sortDir;
                return 0;
            });
        }
        if (filterBy.labels) {
            const labels = filterBy.labels.split(',');
            filterBugs = filterBugs.filter(bug => bug.labels.some(label => labels.includes(label)));
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

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Bad bug Id`

        bugs.splice(idx, 1)
        _saveBugs()
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't remove bug`
    }
}

async function save(bugToSave) {

    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Bad bug Id`

            bugs.splice(idx, 1, bugToSave);
        } else {
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave);
        }
        _saveBugs()
    } catch (err) {
        loggerService.error(err)
        throw `couldn't save bug`
    }
    return bugToSave
}

async function _saveBugs() {
    utilService.writeJsonFile('./data/bug.json', bugs)
}