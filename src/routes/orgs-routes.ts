import express from 'express'
import { OrgsController } from '../controllers/orgs-controller'

const router = express.Router()
const orgsControllerInstance = new OrgsController()

router.post('/', async(req, res) => await orgsControllerInstance.createOrg(req, res))
router.get('/', async(req, res) => await orgsControllerInstance.getAllOrgs(req, res))
router.get('/:id', async(req, res) => await orgsControllerInstance.getOrgInfo(req, res))
router.patch('/:id/info', async(req, res) => await orgsControllerInstance.updateOrg(req, res))
router.delete('/:id', async(req, res) => await orgsControllerInstance.deleteOrg(req, res))
router.get('/search/org', async(req, res) => await orgsControllerInstance.searchForOrg(req, res))

export default router