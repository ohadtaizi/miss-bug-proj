import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug, addBugMsg, removeBugMsg } from './bug.controller.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()


router.get('/', getBugs)
router.get('/:bugId', getBug);
router.put('/:bugId',requireAuth, updateBug);
router.post('/', requireAuth, addBug); // Add 'requireAuth'
router.delete('/:bugId',requireAuth, removeBug);


router.post('/:id/msg', requireAuth, addBugMsg)

router.delete('/:id/msg/:msgid', requireAuth, removeBugMsg)
export const BugRoutes = router