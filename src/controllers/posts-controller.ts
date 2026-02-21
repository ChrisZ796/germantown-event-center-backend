import express from 'express'
import { prisma } from '../../prisma/lib/prisma'

export class PostsController {
    async populateFeed(req: express.Request, res: express.Response) {
        try {
        const totalPosts = await prisma.post.count()
        const take = 5
        const skip = totalPosts > take ? Math.floor(Math.random() * (totalPosts - take + 1)) : 0
        const posts = await prisma.post.findMany({
        skip,
        take
        })
        res.status(200).json({
        message: 'Feed populated successfully',
        posts: posts
        })
    }
    catch (error) {
        res.status(500).json({
        message: "Unable to retrieve posts",
        error: error instanceof Error ? error.message : String(error)
        })
    }
    }   

    async getPostInfo(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const post = await prisma.post.findUnique({
            where: {postID: Number(id)}
            })
            if (!post) {
            res.status(204).json({
                message: 'Post not found'
            })
            }
            else {
            res.status(200).json({
                post: post
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: 'Error retrieving post',
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async createPost(req: express.Request, res: express.Response) {
        const { title, description, eventDate, eventLocation, hours, orgID } = req.body
        try {
            const post = await prisma.post.create({
            data: {
                title: title,
                description: description,
                eventDate: eventDate,
                eventLocation: eventLocation,
                hours: hours,
                org: {
                connect: { orgID: orgID }
                }
            }
            })
            res.status(201).json({
            message: 'Post created successfully',
            post: post
            })
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to create post",
            error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    async deletePost(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const post = await prisma.post.delete({
            where: { postID: Number(id) }
            })
            if (post) {
            res.status(202).json({
                message: 'Post deleted successfully'
            })
            }
            else {
            res.status(204).json({
                message: 'Post not found'
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to delete post",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async updatePost(req: express.Request, res: express.Response) {
        const { id } = req.params
        const { title, description, eventDate, eventLocation, hours } = req.body
        try {
            const post = await prisma.post.update({
            where: { postID: Number(id) },
            data: { 
                title: title,
                description: description,
                eventDate: eventDate,
                eventLocation: eventLocation,
                hours: hours
            }
            })
            if (post) {
            res.status(200).json({
                message: 'Post updated successfully',
                post: post
            })
            }
            else {
            res.status(204).json({
                message: 'Post not found'
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to update post",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async finishPost(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const closed = await prisma.post.findUnique({
            where: { postID: Number(id) }
            })
            if(!closed?.finished)
            {
            const post = await prisma.post.update({
                where: { postID: Number(id) },
                data: { 
                finished: true
                }
            })
            const users = await prisma.userRegistrations.findMany({
                where: {
                postID: Number(id)
                }
            })
            await prisma.$transaction(
                users.map(user => prisma.user.update({
                where: {userID: user.userID },
                data: { volunteerHours: { increment: post.hours },  eventsAttended: { increment: 1 }}
                }))
            )
            if (post) {
                res.status(200).json({
                message: 'Post closed successfully',
                post: post,
                users
                })
            }
            else {
                res.status(204).json({
                message: 'Post not found'
                })
            }
            }
            else {
            res.status(200).json({
                message: 'Post is already closed'
            })
            }
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to close post",
            error: error instanceof Error ? error.message : String(error)
        })
        }
    }

    async getRegisteredUsers(req: express.Request, res: express.Response) {
        const { id } = req.params
        try {
            const post = await prisma.post.findUnique({
            where: { postID: Number(id) },
            include: {
                registrations: true
            }
            })
            res.status(200).json({
            message: 'Registrations retrieved successfully',
            registrations: post?.registrations
            })
        }
        catch (error) {
            res.status(500).json({
            message: "Unable to retrieve registrations",
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

}