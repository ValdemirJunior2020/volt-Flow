// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\routes\employee.routes.js
import express from 'express'
import {
  addEmployee,
  editEmployee,
  listEmployees,
  removeEmployee,
} from '../controllers/employee.controller.js'

const router = express.Router()

router.get('/', listEmployees)
router.post('/', addEmployee)
router.put('/:id', editEmployee)
router.delete('/:id', removeEmployee)

export default router