import express from 'express'
import cors from 'cors'


// import { bugService } from './api/bug/bugService.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser';
import { BugRoutes } from './api/bug/bugRoutes.js';
import { userRoutes } from './api/user/user.routes.js';
import { authRoutes } from './api/auth/auth.routes.js';

// import { UserRoutes } from './api/user/user.routes.js'
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

app.use('/api/bug', BugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)



// app.use('/api/user', UserRoutes)
const port = 3030;


const PORT = process.env.PORT || 3030
console.log(process.env.PORT)


app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
