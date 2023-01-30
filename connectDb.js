const mongoose = require('mongoose')

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DB connected')
  } catch (error) {
    console.log('error to connect Db')
  }
 
} 
  
module.exports=connectDb