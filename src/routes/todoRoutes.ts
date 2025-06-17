import { Router } from "express"
import { create, deleteTodo, getById, getAll, update } from "../controllers/todoControllers"

import { authenticate } from "../middleware/authMiddleware";

const router = Router ()

// Get all Todo
router.get('/',authenticate, getAll)

// Get by Todo Id
router.get('/:id',authenticate, getById)

// Create new Todo
router.post('/',authenticate, create)

// Update by Todo Id
router.put('/:id',authenticate, update)

// Delete by Todo Id
router.delete('/:id',authenticate, deleteTodo)

export default router