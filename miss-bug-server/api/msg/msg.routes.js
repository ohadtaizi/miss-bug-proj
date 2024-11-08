import express from 'express'


import { requireAuth } from '../../middlewares/require-auth.middleware.js'

import { log } from '../../middlewares/log.middleware.js'


import {addmsg, getmsgs, deletemsg} from './msg.controller.js'


const router = express.Router()


router.get('/', log, getmsgs)
router.post('/',  log, requireAuth, addmsg)
router.delete('/:id',  requireAuth, deletemsg)


export const msgRoutes = router
