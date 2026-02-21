import express from 'express'
import { PostsController } from '../controllers/posts-controller'

const router = express.Router()
const postsController = new PostsController()

router.get('/feed', async(req, res) => await postsController.populateFeed(req, res))
router.get('/:id', async(req, res) => await postsController.getPostInfo(req, res))
router.post('/', async(req, res) => await postsController.createPost(req, res))
router.patch('/organizations/:id', async(req, res) => await postsController.updatePost(req, res))
router.delete('/:id', async(req, res) => await postsController.deletePost(req, res))
router.get('/:id/register', async(req, res) => await postsController.getRegisteredUsers(req, res))
router.patch('/:id/register', async(req, res) => await postsController.finishPost(req, res))
router.patch('/users/:id', async(req, res) => await postsController.registerUser(req, res))

export default router