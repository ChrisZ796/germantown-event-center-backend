import express from 'express'
import { OrgsController } from '../controllers/orgs-controller'

const router = express.Router()
const orgsControllerInstance = new OrgsController()

router.post('/', async(req, res) => orgsControllerInstance.createOrg(req, res))
router.get('/', async(req, res) => orgsControllerInstance.getAllOrgs(req, res))
router.get('/:id', async(req, res) => orgsControllerInstance.getOrgInfo(req, res))
router.patch('/:id', async(req, res) => orgsControllerInstance.updateOrg(req, res))
router.delete('/:id', async(req, res) => orgsControllerInstance.deleteOrg(req, res))

export default router