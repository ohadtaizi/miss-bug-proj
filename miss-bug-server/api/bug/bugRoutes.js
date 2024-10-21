import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'


const router = express.Router()


router.get('/', getBugs)
router.get('/:BugId', getBug)
router.put('/:BugId', updateBug)
router.post('/', addBug)
router.delete('/:BugId', removeBug)


export const BugRoutes = router
