import express from 'express'
import { prisma } from '../../prisma/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../types/auth'

export class UsersController {
    async createUser(req: express.Request, res: express.Response) {
        const { username, password, firstname, lastname, email } = req.body
        console.log(req.body)
        const hashed = await bcrypt.hash(password, 10)
        try {
            await prisma.user.create({
            data: {
                username: username,
                pswd: hashed,
                firstname: firstname,
                lastname: lastname,
                email: email,
                volunteerHours: 0,
                eventsAttended: 0
            }
            })
            res.status(201).json({
            message: 'User created successfully',
            })
        
        } catch (error) {
            res.status(500).json({
            message: 'Unable to create user',
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async searchForUser(req: express.Request, res: express.Response) {
        const { query } = req.query;
        try {
            const userResults = await prisma.user.findMany({
            where: { 
                firstname: { contains: query as string }
            }
            })

            res.status(200).json({
            message: { userResults }
            })
            if (!userResults) {
            res.status(204).json({
                message: 'No users found'
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to search users",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async loginUser(req: express.Request, res: express.Response) {
        console.log("Hello World")
        const {username, password} = req.body;
        try {
            const user = await prisma.user.findUnique({
            where:{
                username: username
            }
            })


            console.log(user)

            const passwordCheck = user ? await bcrypt.compare(password, user.pswd) : false

            if (!passwordCheck) {
            return res.status(401).json({
                message: "Wrong password"
            })
            }

            const secret = process.env.JWT_SECRET
            if (!secret) {
            return res.status(500).json({
                message: "JWT Secret not set up"
            })
            }

            const token = user ? jwt.sign(
                { userID: user.userID, username: user.username },
                secret,
                { algorithm: 'HS256', expiresIn: '1h' }
            ) : ""

            console.log(user)
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // false for local dev  (http). set true for deployment (HTTPS).
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000,
                path: '/',
            }).status(200).json({
                message: "Login accepted",
                userID: user?.userID
            })
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to authenticate",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async getUserInfo(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const user = await prisma.user.findUnique({
            where: { userID: Number(id) },
            include: {
                favoriteOrgs: true
            }
            })
            if (user) {
            res.status(200).json(user)
            }
            else {
            res.status(204).json({
                message: 'User not found'
            })
        }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to retrieve user",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async updateUser(req: express.Request, res: express.Response) {
        const { id } = req.params
        const { username, pswd, firstname, lastname, email } = req.body
        try {
            const user = await prisma.user.update({
            where: { userID: Number(id) },
            data: { 
                username: username,
                pswd: pswd,
                firstname: firstname,
                lastname: lastname,
                email: email
            }
            })
            if (user) {
            user.username = username
            user.pswd = pswd
            user.firstname = firstname
            user.lastname = lastname
            user.email = email
            res.status(200).json({
                message: 'User updated successfully',
                user: user
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
            message: "Unable to find user",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async deleteUser(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const user = await prisma.user.delete({
            where: ( { userID: Number(id) } )
            })
            if (user) {
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
            message: "Unable to delete user",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async addFavoriteOrg(req: express.Request, res: express.Response) {
        const { id } = req.params
        const { orgID } = req.body

        try {
            // Check if already favorited
            const existing = await prisma.userFavorites.findUnique({
            where: {
                userID_orgID: {
                userID: Number(id),
                orgID: Number(orgID)
                }
            }
            })

            let actionMessage

            if (existing) {
            // Remove favorite
            await prisma.userFavorites.delete({
                where: {
                userID_orgID: {
                    userID: Number(id),
                    orgID: Number(orgID)
                }
                }
            })
            actionMessage = 'Removed organization from favorites'
            } else {
            // Add favorite
            await prisma.userFavorites.create({
                data: {
                userID: Number(id),
                orgID: Number(orgID)
                }
            })
            actionMessage = 'Added organization to favorites'
            }

            res.status(200).json({ message: actionMessage })
        } catch (error) {
            res.status(500).json({
            message: "Unable to update favorites",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async getUserFavoriteOrganizations(req: express.Request, res: express.Response) {
        if (!req.body.userID) {
            return res.status(401).json({ message: 'Not authenticated' })
        }
        try {
            const user = await prisma.user.findUnique({
            where: { userID: Number(req.body.userID) },
            include: {
                favoriteOrgs: true
            }
            })
            if (user) {
                res.status(200).json(user.favoriteOrgs)
            }
            else {
                res.status(204).json({
                    message: 'User not found'
                })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to retrieve user",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }
}