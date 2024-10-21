import { bugService } from './bugService.js'
export async function getBugs (req, res) {
	const {title, description, severity, createdAt ,pageIdx, sortBy, sortDir}= req.query
	const filterBy={title, description, severity:+severity, createdAt,pageIdx, sortBy, sortDir}
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
		const { _id, title, description, severity, createdAt } = req.body
		const bugToSave = { _id, title, description, severity: +severity, createdAt }
		const savedBugr = await bugService.save(bugToSave)
		res.send(savedBugr)

		console.log("savedBugr", savedBugr)
	} catch (err) {
		console.log("error")
		res.status(400).send(err)
	}
}


export async function addBug(req, res) {
	const {  title, description, severity, createdAt } = req.body
	const bugToSave = {  title, description, severity: +severity, createdAt }

	try {
		const savedBugr = await bugService.save(bugToSave)
		res.send(savedBugr)
	} catch (err) {
		res.status(400).send(err)
	}
}


export async function getBug(req, res) {
	const { bugId } = req.params

	try {
		const bug = await bugService.getById(bugId)
		res.send(bug)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function removeBug (req, res) {

	try {
		const { bugId } = req.params
		console.log("bugId", bugId)
		await bugService.remove(bugId)
		res.send('OK')
	} catch (err) {
		console.log("/api/bug/:bugId", err)
		res.status(400).send(`Couldn't remove bug`)
	}
}
