import express from 'express'
import { prisma } from '../../prisma/lib/prisma'

export class OrgsController {
    async createOrg(req: express.Request, res: express.Response) {
        const { orgName, pswd, email, phoneNumber, address, website, linkedin } = req.body
        try {
            await prisma.organization.create({
            data: {
                orgName: orgName,
                pswd: pswd,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                website: website,
                linkedin: linkedin
            }
            })
            res.status(201).json({
            message: 'Organization created successfully',
        })
        } 
        catch (error) {
            res.status(500).json({
            message: 'Unable to create organization',
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async getOrgInfo(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const org = await prisma.organization.findUnique({
            where: { orgID: Number(id) }
            })
            if (org) {
            res.status(200).json(org)
            }
            else {
            res.status(204).json({
                message: 'Organization not found'
            })
        }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to retrieve organization",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async getAllOrgs(req: express.Request, res: express.Response) {
        try {
            const orgs = await prisma.organization.findMany()
            if (orgs) {
            res.status(200).json(orgs)
            }
            else {
            res.status(204).json({
                message: 'Organizations not found'
            })
        }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to retrieve organizations",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async updateOrg(req: express.Request, res: express.Response) {
        const { id } = req.params
        const { orgName, pswd, email, phoneNumber, address, website, linkedin } = req.body
        try {
            const org = await prisma.organization.update({
            where: { orgID: Number(id) },
            data: { 
                orgName: orgName,
                pswd: pswd,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                website: website,
                linkedin: linkedin
            }
            })
            if (org) {
            org.orgName = orgName
            org.pswd = pswd
            org.email = email
            org.phoneNumber = phoneNumber
            org.email = email
            org.address = address
            org.website = website
            org.linkedin = linkedin
            res.status(200).json({
                message: 'org updated successfully',
                org: org
            })
            }
            else {
            res.status(204).json({
                message: 'Organization not found'
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to find organization",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async deleteOrg(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const org = await prisma.organization.delete({
            where: { orgID: Number(id) }
            })
        if (org) {
            res.status(202).json({
            message: 'User deleted successfully'
            })
        }
        else {
            res.status(204).json({
            message: 'User not found'
            })
        }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to delete organization",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async searchForOrg(req: express.Request, res: express.Response) {
        const { query } = req.query;
        try {
            const orgResults = await prisma.organization.findMany({
            where: { 
                orgName: { contains: query as string} 
            }
            })
            res.status(200).json({
            message: { orgResults }
            })
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to search organizations",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }
}