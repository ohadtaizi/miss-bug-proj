const { DEV, VITE_LOCAL } = import.meta.env


import { getRandomIntInclusive, makeId } from '../util.service'


import { carService as local } from './car.service.local'
import { carService as remote } from './car.service.remote'

function getEmptyBug(title = '', description = '', severity = 0, createdAt = '',msgs= []) {
	return { title, description, severity, createdAt ,msgs}
}
function getDefaultFilter() {
	return { title: '', description: '', severity: 1, createdAt: '', labels: [], sortBy: 'title', sortDir: 0, pageIdx: 0 }
   


}





const service = VITE_LOCAL === 'true' ? local : remote
export const carService = { getEmptyBug, getDefaultFilter, ...service }


// Easy access to this service from the dev tools console
// when using script - dev / dev:local


if (DEV) window.carService = carService
