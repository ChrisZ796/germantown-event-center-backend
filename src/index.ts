import express from 'express'
import cors from 'cors'
import { prisma } from '../prisma/lib/prisma'
import dotenv from 'dotenv'

import usersRouter from './routes/users-routes'
import orgsRouter from './routes/orgs-routes'
import postsRouter from './routes/posts-routes'
import cookieParser from 'cookie-parser'

const app = express()
const port = 8080


app.use(express.json())
app.use(cors({
  origin:["https://germantown-event-center.vercel.app", "http://localhost:5173", "https://germantown-event-center-i6se0ivv4.vercel.app"],
   methods:["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials:true
}))
app.use((req, res, next) => {
console.log(`Incoming request: ${req.method} ${req.url}`);
next();
});

app.use(cookieParser())
dotenv.config()

app.use("/users", usersRouter)
app.use("/organizations", orgsRouter)
app.use("/posts", postsRouter)


app.get('/directory', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
        select: 
        {
          userID: true,
          username: true,
          firstname: true
        }
    })
    const organizations = await prisma.organization.findMany({
        select: 
        {
          orgID: true,
          orgName: true
        }
    })
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