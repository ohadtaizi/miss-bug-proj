import { msgService } from '../../services/msg'


import { store } from '../store'
import { ADD_MSG, REMOVE_MSG, SET_MSGS } from '../reducers/msg.reducers'
import { SET_SCORE } from '../reducers/user.reducer'


export async function loadMsgs() {
	try {
		const Msgs = await msgService.query()
		store.dispatch({ type: SET_MSGS, Msgs })
	} catch (err) {
		console.log('MsgActions: err in loadMsgs', err)
		throw err
	}
}


export async function addMsg(Msg) {
	try {
		const addedMsg = await msgService.add(Msg)
		store.dispatch(getActionAddMsg(addedMsg))
		const { score } = addedMsg.byUser
		store.dispatch({ type: SET_SCORE, score })
	} catch (err) {
		console.log('MsgActions: err in addMsg', err)
		throw err
	}
}


export async function removeMsg(MsgId) {
	try {
		await msgService.remove(MsgId)
		store.dispatch(getActionRemoveMsg(MsgId))
	} catch (err) {
		console.log('MsgActions: err in removeMsg', err)
		throw err
	}
}
// Command Creators
export function getActionRemoveMsg(MsgId) {
	return { type: REMOVE_MSG, MsgId }
}
export function getActionAddMsg(Msg) {
	return { type: ADD_MSG, Msg }
}
