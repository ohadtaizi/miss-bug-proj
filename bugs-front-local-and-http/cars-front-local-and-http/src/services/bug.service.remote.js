import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = `//localhost:3030/api/bug/`

export const bugService = {
	query,
	getById,
	remove,
	save,
	getEmptyBug,
	getDefaultFilter,
}

async function query(filterBy = {}) {
	var { data: bugs } = await axios.get(BASE_URL, {params: filterBy})

	// if (filterBy.title) {
	// 	const regExp = new RegExp(filterBy.title, 'i')
	// 	bugs = bugs.filter(bug => regExp.test(bug.title))
	// }
    
	// if (filterBy.severity) {
	// 	bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
	// }
	return bugs
}

async function getById(bugId) {
	const { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
	const { data: res } = await axios.delete(BASE_URL + bugId)
    return res
}

async function save(bug) {
    // const queryParams = 
    //     `?_id=${bug._id || ''}&title=${bug.title}&severity=${bug.severity}`

    // const url = BASE_URL + 'save' + queryParams
const method =bug._id ?'put': 'post'
	
		var { data: savedBug } = await axios[method](BASE_URL +(bug._id||''),bug)

    // const { data: savedBug } = await axios.get(url)

    return savedBug
}

function getEmptyBug(title = '', description = '', severity = 0, createdAt = '') {
	return { title,description, severity,createdAt }
}

function getDefaultFilter() {
	return { title: '', description: '', severity: 0, createdAt: '' }
}