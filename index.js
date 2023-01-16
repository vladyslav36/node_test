const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 7000
const MODE = process.env.MODE

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({message:'hello333'})
})

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`)
})