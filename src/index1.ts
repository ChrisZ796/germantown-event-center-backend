import express from 'express'
import cors from 'cors'
import { prisma } from '../prisma/lib/prisma'
import dotenv from 'dotenv'


const app = express()
const port = 8080


app.use(express.json())
app.use(cors({origin:"https://germantown-event-center.vercel.app", methods:["GET", "POST", "PUT", "DELETE", "PATCH"], credentials:true}))
app.use((req, res, next) => {
console.log(`Incoming request: ${req.method} ${req.url}`);
next();
});

dotenv.config()

import usersRouter from './routes/users-routes'
app.user("/users", usersRouter)

import orgsRouter from './routes/orgs-routes'
app.user("/orgs", orgsRouter)

import postsRouter from './routes/posts-routes'
app.user("/posts", postsRouter)


app.get('/directory', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    const organizations = await prisma.organization.findMany()
    res.status(200).json({
      message: 'Directory retrieved successfully',
      users: users,
      organizations: organizations
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Unable to retrieve directory list",
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})