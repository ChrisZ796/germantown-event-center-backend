import express from 'express'
import { prisma } from '../../prisma/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UsersController {
    async createUser(req: express.Request, res: express.Response) {
        const { username, pswd, firstname, lastname, email } = req.body
        const hashed = await bcrypt.hash(pswd, 10)
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

    async getUser(req: express.Request, res: express.Response) {
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
        const {username, password} = req.body;
        try {
            const user = await prisma.user.findUnique({
            where:{
                username: username
            }
            })
            if (!user) {
            return res.status(401).json({
                message: "Username not found"
            })
            }

            const passwordCheck = await bcrypt.compare(password, user.pswd)

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

            const token = jwt.sign(
            {
                Id: user.userID,
                username: user.username
            },
            secret,
            { algorithm: 'HS256', expiresIn: '1h'}
            )

            res.status(200).json({
            message: "Login accepted",
            token: token
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

    async registerUser(req: express.Request, res: express.Response) {
        const { id } = req.params
        const { userID } = req.body

        try {
            const existing = await prisma.userRegistrations.findUnique({
            where: {
                userID_postID: {
                postID: Number(id),
                userID: Number(userID)
                }
            }
            })

            if (existing) {
            await prisma.userRegistrations.delete({
                where: {
                userID_postID: {
                    postID: Number(id),
                    userID: Number(userID)
                }
                }
            })
            
            const post = await prisma.post.update({
                where: { postID: Number(id) },
                data: { numberInterested: { decrement: 1} }
            })
            
            res.status(200).json({
                message: 'User unregistered successfully',
                post
            })
            }
            else {
            await prisma.userRegistrations.create({
                data: {
                userID: Number(userID),
                postID: Number(id),
                }
            })
            
            const post = await prisma.post.update({
                where: { postID: Number(id) },
                data: { numberInterested: { increment: 1 } }
            })

            res.status(200).json({
                message: 'User registered successfully',
                post
            })
            }

        } 
        catch (error) {
            res.status(500).json({
            message: "Unable to register user",
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
}