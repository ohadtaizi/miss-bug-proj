import express from 'express'
import cors from 'cors'


import { bugService } from './api/bug/bugService.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser';

const app = express()



const bugsOptions = {
	origin: ['http://127.0.0.1:5173', 'http://localhost:5173',
		'http://127.0.0.1:5174', 'http://localhost:5174'
	],
	credentials: true,

}

app.use(express.static('public'))
app.use(cors(bugsOptions))
app.use(express.json())
app.use(cookieParser())

import { BugRoutes } from './api/bug/bugRoutes.js';
app.use('/api/bug',BugRoutes)
const port = 3030;




app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
