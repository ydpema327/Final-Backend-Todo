import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import todoRoutes from './routes/todoRoutes'
dotenv.config()

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: '*', // fronted origin
        credentials: false
    })
)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/todos', todoRoutes)

// 🏠 Root route
app.get('/', (req, res) => {
  res.send(`
    🚀 API is running...
    🌐 Status: Online
    
  `)
})

export default app
