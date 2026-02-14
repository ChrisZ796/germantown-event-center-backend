import express from 'express'
import { PostsController } from '../controllers/posts-controller'

const router = express.Router()
const postsController = new PostsController()

router.get('/feed', async(req, res) => postsController.populateFeed(req, res))
router.get('/:id', async(req, res) => postsController.getPostInfo(req, res))
router.post('/', async(req, res) => postsController.createPost(req, res))
router.patch('/:id', async(req, res) => postsController.updatePost(req, res))
router.delete('/:id', async(req, res) => postsController.deletePost(req, res))
router.get('/:id/register', async(req, res) => postsController.getRegisteredUsers(req, res))
router.patch('/:id/register', async(req, res) => postsController.finishPost(req, res))

export default router