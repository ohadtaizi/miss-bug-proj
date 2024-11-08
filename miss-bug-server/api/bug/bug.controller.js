import { authService } from '../auth/auth.service.js'
import { bugService } from './bugService.js'
import { loggerService } from '../../services/logger.service.js';
export async function getBugs(req, res) {
	const { title, description, severity, labels, createdAt, pageIdx, sortBy, sortDir } = req.query
	const filterBy = { title, description, severity: +severity, labels, createdAt, pageIdx, sortBy, sortDir: +sortDir }
	console.log(filterBy)

	try {
		
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
	} catch (err) {
		res.status(400).send(err)
	}
}
export async function updateBug(req, res) {
	

	const { loggedinUser, body: bug } = req
    const { _id: userId, isAdmin } = loggedinUser


    if(!isAdmin && bug.owner._id !== userId) {
        res.status(403).send('Not your bug...')
        return
    }

	try {


		// const user = req.loggedinUser
		// const { _id, title, description, severity, createdAt, owner } = req.body
		// const bugToSave = { _id, title, description, severity: +severity, createdAt, owner }
		const savedBugr = await bugService.update(bugToSave, user)
		res.json(updatedCar)

		console.log("savedBugr", savedBugr)
	} catch (err) {
		console.log("error")
		res.status(400).send(err)
	}
}


export async function addBug(req, res) {
	// const { title, description, severity, createdAt } = req.body
	// const bugToSave = { title, description, severity: +severity, createdAt, owner: user }

	try {
		console.log('Request Body:', req.body); // Log the request body
        console.log('Cookies:', req.cookies); // Log cookies to ensure the token is present
		const { loggedinUser, body: bug } = req

		if (!loggedinUser) {
            console.log('User is not authenticated'); // Log if no user is found
            return res.status(401).send('Not Authenticated');
        }
		console.log('Logged-in User:', loggedinUser); // Log the logged-in user details

		bug.owner = loggedinUser
		const addedBug = await bugService.add(bug)
		res.json(addedBug)
		console.log('Added Bug:', addedBug); // Log the added bug details


	} catch (err) {
		loggerService.error('Failed to add bug', err);
		res.status(400).send({ err: 'Failed to add bug' });
	}
}
// Backend car.controller
export async function addBugMsg(req, res) {
	const { loggedinUser } = req
	try {
		const bugId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser
		}
		const savedMsg = await bugService.addBugMsg(bugId, msg)
		res.json(savedMsg)
	} catch (err) {
		loggerService.error('Failed to update bug', err)
		res.status(400).send({ err: 'Failed to update bug' })

	}
}
export async function removeBugMsg(req, res) {


	try {
		const { id: bugId, msgid } = req.params

		const removeId = await bugService.removeBugMsg(bugId, msgid)
		res.send(removeId)
	} catch (err) {
		loggerService.error('Failed to update bug', err)
		res.status(400).send({ err: 'Failed to update bug' })

	}
}




export async function getBug(req, res) {
	const { bugId } = req.params
	let { visitedBugs = [] } = req.cookies;


	if (visitedBugs?.length >= 3) {
		return res.status(401).send('wait a sec')
	}


	if (!visitedBugs.includes(bugId)) {
		visitedBugs.push(bugId)
	}


	res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 });

	try {
		const bug = await bugService.getById(bugId)
		res.send(bug)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function removeBug(req, res) {

	try {
		const user = req.loggedinUser
		const { bugId } = req.params
		console.log("bugId", bugId)
		await bugService.remove(bugId, user)
		res.send('OK')
	} catch (err) {
		console.log("/api/bug/:bugId", err)
		res.status(400).send(`Couldn't remove bug`)
	}
}