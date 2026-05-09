import express from 'express'
import { UsersController } from '../controllers/users-controller'
import { authenticateToken } from '../middleware/authenticate'


const router = express.Router()
const usersController = new UsersController()

router.post('/', async(req, res) => await usersController.createUser(req, res))
router.get('/:id', async(req, res) => await usersController.getUserInfo(req, res))
router.get('/search/user', async(req, res) => await usersController.searchForUser(req, res))
router.post('/login', async(req, res) => await usersController.loginUser(req, res))
router.patch('/:id/info', async(req, res) => await usersController.updateUser(req, res))
router.delete('/:id', async(req, res) => await usersController.deleteUser(req, res))
router.patch('/:id/favorites', async(req, res) => await usersController.addFavoriteOrg(req, res))
router.get('/favoriteOrgs', authenticateToken, async(req, res) => await usersController.getUserFavoriteOrganizations(req, res))

export default router