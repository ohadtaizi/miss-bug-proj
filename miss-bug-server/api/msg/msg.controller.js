import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/userService.js';
import { authService } from '../auth/auth.service.js'
import { msgService } from './msg.service.js'


export async function getmsgs(req, res) {
	try {
		const msgs = await msgService.query(req.query)
		res.send(msgs)
	} catch (err) {
		loggerService.error('Cannot get msgs', err)
		res.status(400).send({ err: 'Failed to get msgs' })
	}
}


export async function deletemsg(req, res) {
	var { loggedinUser } = req
    const { id: msgId } = req.params
    
	try {
		const deletedCount = await msgService.remove(msgId)
		if (deletedCount === 1) {
            socketService.broadcast({ type: 'msg-removed', data: msgId, userId: loggedinUser._id })
			res.send({ msg: 'Deleted successfully' })
		} else {
			res.status(400).send({ err: 'Cannot remove msg' })
		}
	} catch (err) {
		loggerService.error('Failed to delete msg', err)
		res.status(400).send({ err: 'Failed to delete msg' })
	}
}


export async function addmsg(req, res) {
	var { loggedinUser } = req


	try {
		var msg = req.body
		const { aboutUserId } = msg
		msg.byUserId = loggedinUser._id
		msg = await msgService.add(msg)


		// Give the user credit for adding a msg
		// var user = await userService.getById(msg.byUserId)
		// user.score += 10


		loggedinUser.score += 10
		await userService.update(loggedinUser)


		// Update user score in login token as well


		const loginToken = authService.getLoginToken(loggedinUser)
		res.cookie('loginToken', loginToken)


		// prepare the updated msg for sending out


		msg.byUser = loggedinUser
		msg.aboutUser = await userService.getById(aboutUserId)


		delete msg.aboutUser.givenmsgs
		delete msg.aboutUserId
		delete msg.byUserId


		socketService.broadcast({ type: 'msg-added', data: msg, userId: loggedinUser._id })
		socketService.emitToUser({ type: 'msg-about-you', data: msg, userId: msg.aboutUser._id })


		const fullUser = await userService.getById(loggedinUser._id)
		socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })


		res.send(msg)
	} catch (err) {
		loggerService.error('Failed to add msg', err)
		res.status(400).send({ err: 'Failed to add msg' })
	}
}
