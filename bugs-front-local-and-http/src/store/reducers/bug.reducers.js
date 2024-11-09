export const SET_BUGS = 'SET_SET_BUGS'
export const SET_BUG = 'SET_BUG'
export const REMOVE_BUG = 'REMOVE_bug'
export const ADD_BUG = 'ADD_BUG'
export const UPDATE_bug = 'UPDATE_BUG'
export const ADD_bug_MSG = 'ADD_bug_MSG'


const initialState = {
    bugs: [],
    bug: null
}


export function bugReducer(state = initialState, action) {
    var newState = state
    var bugs
    switch (action.type) {
        case SET_BUG:
            newState = { ...state, bugs: action.bugs }
            break
        case SET_BUG:
            newState = { ...state, bug: action.bug }
            break
        case REMOVE_BUG:
            const lastRemovedbug = state.bugs.find(bug => bug._id === action.bugId)
            bugs = state.bugs.filter(bug => bug._id !== action.bugId)
            newState = { ...state, bugs, lastRemovedbug }
            break
        case ADD_BUG:
            newState = { ...state, bugs: [...state.bugs, action.bug] }
            break
        case UPDATE_bug:
            bugs = state.bugs.map(bug => (bug._id === action.bug._id) ? action.bug : bug)
            newState = { ...state, bugs }
            break
        case ADD_bug_MSG:
            newState = { ...state, bug: { ...state.bug, msgs: [...state.bug.msgs || [], action.msg] } }
            break
        default:
    }
    return newState
}


// unitTestReducer()


function unitTestReducer() {
    var state = initialState
    const bug1 = { _id: 'b101', vendor: 'bug ' + parseInt(Math.random() * 10), msgs: [] }
    const bug2 = { _id: 'b102', vendor: 'bug ' + parseInt(Math.random() * 10), msgs: [] }


    state = bugReducer(state, { type: SET_bugS, bugs: [bug1] })
    console.log('After SET_bugS:', state)


    state = bugReducer(state, { type: ADD_bug, bug: bug2 })
    console.log('After ADD_bug:', state)


    state = bugReducer(state, { type: UPDATE_bug, bug: { ...bug2, vendor: 'Good' } })
    console.log('After UPDATE_bug:', state)


    state = bugReducer(state, { type: REMOVE_bug, bugId: bug2._id })
    console.log('After REMOVE_bug:', state)


    const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
    state = bugReducer(state, { type: ADD_bug_MSG, bugId: bug1._id, msg })
    console.log('After ADD_bug_MSG:', state)


    state = bugReducer(state, { type: REMOVE_bug, bugId: bug1._id })
    console.log('After REMOVE_bug:', state)
}
