import { bugService } from '../../services/bug'
import { store } from '../store'
import { ADD_BUG, REMOVE_BUG, SET_BUGS, SET_BUG, UPDATE_BUG, ADD_BUG_MSG } from '../reducers/bug.reducer'


export async function loadbugs(filterBy) {
    try {
        const bugs = await bugService.query(filterBy)
        store.dispatch(getCmdSetbugs(bugs))
    } catch (err) {
        console.log('Cannot load bugs', err)
        throw err
    }
}


export async function loadbug(bugId) {
    try {
        const bug = await bugService.getById(bugId)
        store.dispatch(getCmdSetbug(bug))
    } catch (err) {
        console.log('Cannot load bug', err)
        throw err
    }
}




export async function removebug(bugId) {
    try {
        await bugService.remove(bugId)
        store.dispatch(getCmdRemovebug(bugId))
    } catch (err) {
        console.log('Cannot remove bug', err)
        throw err
    }
}


export async function addbug(bug) {
    try {
        const savedbug = await bugService.save(bug)
        store.dispatch(getCmdAddbug(savedbug))
        return savedbug
    } catch (err) {
        console.log('Cannot add bug', err)
        throw err
    }
}


export async function updatebug(bug) {
    try {
        const savedbug = await bugService.save(bug)
        store.dispatch(getCmdUpdatebug(savedbug))
        return savedbug
    } catch (err) {
        console.log('Cannot save bug', err)
        throw err
    }
}


export async function addbugMsg(bugId, txt) {
    try {
        const msg = await bugService.addbugMsg(bugId, txt)
        store.dispatch(getCmdAddbugMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add bug msg', err)
        throw err
    }
}


// Command Creators:
function getCmdSetbugs(bugs) {
    return {
        type: SET_BUGS,
        bugs
    }
}
function getCmdSetbug(bug) {
    return {
        type: SET_BUG,
        bug
    }
}
function getCmdRemovebug(bugId) {
    return {
        type: REMOVE_BUG,
        bugId
    }
}
function getCmdAddbug(bug) {
    return {
        type: ADD_BUG,
        bug
    }
}
function getCmdUpdatebug(bug) {
    return {
        type: UPDATE_BUG,
        bug
    }
}
function getCmdAddbugMsg(msg) {
    return {
        type: ADD_BUG_MSG,
        msg
    }
}


// unitTestActions()
async function unitTestActions() {
    await loadbugs()
    await addbug(bugService.getEmptybug())
    await updatebug({
        _id: 'm1oC7',
        title: 'bug-Good',
    })
    await removebug('m1oC7')
    // TODO unit test addbugMsg
}
