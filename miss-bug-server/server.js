import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'


// import { bugService } from './api/bug/bugService.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser';
import { BugRoutes } from './api/bug/bugRoutes.js';
import { userRoutes } from './api/user/user.routes.js';
import { authRoutes } from './api/auth/auth.routes.js';
import { msgRoutes } from './api/msg/msg.routes.js';
import { setupSocketAPI } from './services/socket.service.js'


import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

// import { UserRoutes } from './api/user/user.routes.js'
const app = express()
const server = http.createServer(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const bugsOptions = {
        origin: [   'http://127.0.0.1:3000',
                    'http://localhost:3000',
                    'http://127.0.0.1:5173',
                    'http://localhost:5173'
                ],
        credentials: true
    }
    app.use(cors(bugsOptions))
}


// app.use(express.static('public'))
app.all('*', setupAsyncLocalStorage)
app.use(express.json())
app.use(cookieParser())
app.use('/api/bug', BugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/msg', msgRoutes)

setupSocketAPI(server)
// app.use('/api/user', UserRoutes)
const port = process.env.PORT || 3030


console.log(process.env.PORT)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
