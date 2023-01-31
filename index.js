const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const viberBot = require("viber-bot").Bot
const botEvents = require("viber-bot").Events
const TextMessage = require("viber-bot").Message.Text
const connectDb = require('./connectDb')
const User = require('./model/User')
const cors = require('cors')
const jwt=require('jsonwebtoken')

dotenv.config()
connectDb()

const bot = new viberBot({
  authToken: process.env.VIBER_TOKEN,
  name: process.env.VIBER_NAME,
  avatar: "/upload/logo.png",
})
bot
  .setWebhook(`${process.env.API_URL}/viber/webhook`)
  .then(() => console.log("Viber-bot connected"))
  .catch((error) => console.log(`This is error ${error.message}`))

  bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
    
   
    
    try {
     let user=await User.findOne({userId:userProfile.id})
      if (!user) {
      user=await User.create({ authKey: context, userId: userProfile.id, userName: userProfile.name,authMethod:'Viber' })        
      }   
       const token = jwt.sign({ id: user._id },process.env.JWT_SECRET,{expiresIn:'60d'})
      await user.updateOne({ token })        
      bot.sendMessage(
      userProfile,
      new TextMessage(
        `Привет ${userProfile.name}, вы успешно авторизировались. Для входа на сайт закройте окно вайбера и нажмите кнопку войти`
      )
    )
    } catch (error) {
      console.log('error for saving key')
    }
     
    
   
})

// bot.on(botEvents.MESSAGE_RECEIVED, (message, response) => {
//   bot.sendMessage(response.userProfile, new TextMessage("Hi there"))
//  response.send(
//     new TextMessage(
//       `Hello ${response.userProfile.name}, I am ${bot.name}. I reseve your message ${message.text} `
//     )
//   )
// })

const app = express()

const PORT = process.env.PORT || 7000
const MODE = process.env.MODE



app.use(cors())



app.use("/upload", express.static(path.join(__dirname, "/upload")))

app.get("/", (req, res) => {
  res.status(200).json({ message: "main page " })
})
app.post("/api",express.json(), async (req, res) => {
  const { authKey } = req.body
  const user=await User.findOne({authKey})
  
  res.status(200).json({token:user.token})
})
app.use("/viber/webhook", bot.middleware())



 


app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`)  
})
