import { authService } from '../auth/auth.service.js'
import { bugService } from './bugService.js'
export async function getBugs (req, res) {
	const {title, description, severity, labels,createdAt ,pageIdx, sortBy, sortDir}= req.query
	const filterBy={title, description, severity:+severity,labels, createdAt,pageIdx, sortBy, sortDir:+sortDir}
	console.log(filterBy)

	try {
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
	} catch (err) {
		res.status(400).send(err)
	}
}
export async function updateBug (req, res){
	console.log("/api/bug/bugId")


	try {

		
		const user = req.loggedinUser
		const { _id, title, description, severity, createdAt,owner } = req.body
		const bugToSave = { _id, title, description, severity: +severity, createdAt,owner }
		const savedBugr = await bugService.save(bugToSave,user)
		res.send(savedBugr)

		console.log("savedBugr", savedBugr)
	} catch (err) {
		console.log("error")
		res.status(400).send(err)
	}
}


export async function addBug(req, res) {
    const user = req.loggedinUser
	const {  title, description, severity, createdAt } = req.body
	const bugToSave = {  title, description, severity: +severity, createdAt,owner:user }
	
console.log('bugToSave',bugToSave)
	try {
		const savedBugr = await bugService.save(bugToSave,user)
		res.send(savedBugr)
	} catch (err) {
		console.log('addBug err',err)
		res.status(400).send(err)
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

export async function removeBug (req, res) {

	try {
		const user = req.loggedinUser
		const { bugId } = req.params
		console.log("bugId", bugId)
		await bugService.remove(bugId,user)
		res.send('OK')
	} catch (err) {
		console.log("/api/bug/:bugId", err)
		res.status(400).send(`Couldn't remove bug`)
	}
}