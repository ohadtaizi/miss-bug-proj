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
    const method = bug._id ? 'put' : 'post'
    var { data: savedBug } = await axios[method](BASE_URL + (bug._id || ''), bug)


    return savedBug
}


function getEmptyBug(title = '', description = '', severity = 0, createdAt = '') {
	return { title, description, severity, createdAt }
}


function getDefaultFilter() {
	return { title: '', description: '', severity: 1, createdAt: '', labels: [], sortBy: 'title', sortDir: 1, pageIdx: 0 }
   


}
