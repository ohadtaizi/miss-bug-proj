const { DEV, VITE_LOCAL } = import.meta.env


import { getRandomIntInclusive, makeId } from '../util.service'


import { bugService as local } from './bug.service.local'
import { bugService as remote } from './bug.service.remote'

function getEmptyBug(title = makeId(), description = '', severity = getRandomIntInclusive(1, 10), createdAt = '',msgs= []) {
	return { title, description, severity, createdAt ,msgs}
}
function getDefaultFilter() {
	return { title: '', description: '', severity: '', createdAt: '', labels: [], sortBy: '', sortDir: '', pageIdx: '' }
   


}





const service = VITE_LOCAL === 'true' ? local : remote
export const bugService = { getEmptyBug, getDefaultFilter, ...service }


// Easy access to this service from the dev tools console
// when using script - dev / dev:local


if (DEV) window.bugService = bugService
