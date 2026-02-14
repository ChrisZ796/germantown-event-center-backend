import express from 'express'
import { UsersController } from '../controllers/users-controller'

const router = express.Router()
const usersController = new UsersController()

router.post('/users', async(req, res) => usersController.createUser(req, res))
router.get('/users', async(req, res) => usersController.getUser(req, res))
router.post('/users/login', async(req, res) => usersController.loginUser(req, res))
router.get('/users/favorites/:id', async(req, res) => usersController.getUserInfo(req, res))
router.patch('/users/favorites/:id', async(req, res) => usersController.updateUser(req, res))
router.delete('/users/favorites/:id', async(req, res) => usersController.deleteUser(req, res))
router.patch('/users/favorites/:id', async(req, res) => usersController.registerUser(req, res))
router.patch('/users/favorites/:id', async(req, res) => usersController.addFavoriteOrg(req, res))

export default router