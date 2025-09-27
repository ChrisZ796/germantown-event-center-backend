/*
const express = require('express')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const data = require('../data.json')
const posts = require('../post.json')
const app = express()
const port = 8080
*/
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const port = 8080


app.use(express.json())

// Create a new user
app.post('/users', async (req, res) => {
  const { username, pswd, firstname, lastname, email } = req.body
  try {
    await prisma.user.create({
      data: {
        username: username,
        pswd: pswd,
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
      error: error.message
    })
  }

})

// Create a new organization
app.post('/organizations', async (req, res) => {
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
      error: error.message
    })
  }
})

// Get user info
app.get('/users/:id', async (req, res) => {
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
      error: error.message
    })
  }
})

// Get organization info
app.get('/organizations/:id', async (req, res) => {
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
      error: error.message
    })
  }
})

// Get a list of organizations
app.get('/organizations', async (req, res) => {
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
      error: error.message
    })
  }
})

// Update user info
app.patch('/users/:id/info', async (req, res) => {
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
      error: error.message
  })
  }
})

// Update organization info
app.patch('/organizations/:id/info', async (req, res) => {
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
      error: error.message
  })
  }
})

// Search for users
app.get('/users/search', async (req, res) => {
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
      error: error.message
    })
  }
})

// Search for organizations
app.get('/organizations/search', async (req, res) => {
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
      error: error.message
  })
  }
})

// Delete user
app.delete('/users/:id', async (req, res) => {
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
      error: error.message
  })
  }
})

//Delete organization
app.delete('/organizations/:id', async (req, res) => {
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
      error: error.message
   })
  }
})

// Get list of events to display (populate feed)
app.get('/posts', async (req, res) => {
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
      error: error.message
    })
  }
})

// View Event Details
app.get('/posts/:id', async (req, res) => {
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
      error: error.message
    })
  }
})

// Create post
app.post('/posts', async (req, res) => {
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
      error: error.message
    })
  }
})

// Delete post
app.delete('/posts/:id', async (req, res) => {
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
      error: error.message
   })
  }
})

// Update post
app.patch('/posts/organizations/:id', async (req, res) => {
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
      error: error.message
  })
  }
})

// Finish Post
app.patch('/posts/organizations/finish/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await prisma.post.update({
      where: { postID: Number(id) },
      data: { 
        finished: true
      }
    })
    const users = await prisma.user.findMany({
      where: { registeredPosts: {
        some: { postID: Number(id) }
      }}
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
  catch (error) {
    res.status(500).json({
      message: "Unable to close post",
      error: error.message
  })
  }
})

// Register for event
app.patch('/posts/users/:id', async (req, res) => {
  const { id } = req.params
  const { userID } = req.body
  try {
    const post = await prisma.post.update({
      where: { postID: Number(id) },
      data: { 
        registeredUsers: {
          connect: [{ userID: userID }]
        },
        numberInterested: {
          increment: 1
        }
      }
    })
    if (post) {
      res.status(200).json({
        message: 'User registered successfully',
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
      message: "Unable to register user",
      error: error.message
  })
  }
})

// Adding/Removing a favorite organization to a user
app.patch('/users/favorites/:id', async (req, res) => {
  const { id } = req.params
  const { orgID } = req.body
  
  try {
    const user = await prisma.user.findUnique({
      where: { userID: Number(id) },
      include: { favoriteOrgs: {select: {orgID: true} } }
    })
    const favorites = user.favoriteOrgs.some(
      (org) => org.orgID === Number(orgID)
    )
    await prisma.user.update({
      where: { userID: Number (id) },
      data: { 
        favoriteOrgs: favorites
        ? { disconnect: [{ orgID: orgID }] }
        : { connect: [{ orgID: orgID }] } }
    })
    if (user && favorites) {
      res.status(200).json({
        message: 'Removed organization from favorites',
        user: user
      })
    }
    else if (user) {
      res.status(200).json({
        message: 'Added organization to favorites',
        user: user
      })
    }
    else {
      res.status(204).json({
        message: 'Failed to find user or organization'
      })
    }
  }
  catch (error) {
    res.status(500).json({
      message: "Unable to add to favorites",
      error: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
