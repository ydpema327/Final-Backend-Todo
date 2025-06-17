import dotenv from 'dotenv'
import app from './app'
import connectDB from './config/db'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const port = process.env.PORT || 3010

    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })


