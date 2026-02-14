import express from 'express'
import { UsersController } from '../controllers/users-controller'


const router = express.Router()
const usersController = new UsersController()

router.post('/', async(req, res) => usersController.createUser(req, res))
router.get('/:id/favorites', async(req, res) => usersController.getUserInfo(req, res))
router.get('/', async(req, res) => usersController.getUser(req, res))
router.post('/login', async(req, res) => usersController.loginUser(req, res))
router.patch('/:id', async(req, res) => usersController.updateUser(req, res))
router.delete('/:id', async(req, res) => usersController.deleteUser(req, res))
router.patch('/:id/register', async(req, res) => usersController.registerUser(req, res))
router.patch('/:id/favorites', async(req, res) => usersController.addFavoriteOrg(req, res))

export default router