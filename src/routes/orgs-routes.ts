import express from 'express'
import { OrgsController } from '../controllers/orgs-controller'

const router = express.Router()
const orgsControllerInstance = new OrgsController()

router.post('/orgs', async(req, res) => orgsControllerInstance.createOrg(req, res))
router.get('/orgs', async(req, res) => orgsControllerInstance.getAllOrgs(req, res))
router.get('/orgs/:id', async(req, res) => orgsControllerInstance.getOrgInfo(req, res))
router.patch('/orgs/:id', async(req, res) => orgsControllerInstance.updateOrg(req, res))
router.delete('/orgs/:id', async(req, res) => orgsControllerInstance.deleteOrg(req, res))

export default router