import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/require-auth.middleware.js'

import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

const router = express.Router()


router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id',requireAuth, updateUser)
router.delete('/:id', deleteUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)


export const userRoutes = router
