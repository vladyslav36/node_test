const express = require('express')
const dotenv = require('dotenv')
const viberBot = require('viber-bot').Bot
const botEvents = require('viber-bot').Events
const TextMessage = require('viber-bot').Message.Text


dotenv.config()

const PORT = process.env.PORT || 7000
const MODE = process.env.MODE

const bot = new viberBot({
  authToken: process.env.VIBER_TOKEN,
  name: "karmenshop",
  avatar: "/upload/logo.png", 
})


const app = express()
app.use(express.json())

app.use("/viber/webhook", bot.middleware())

app.get('/', (req, res) => {
  res.status(200).json({message:'main page '})
})
bot.on(botEvents.SUBSCRIBED, res => {
  res.send(new TextMessage('hi'))
})
bot.on(botEvents.MESSAGE_RECEIVED, (message, response) => {  
  response.send(new TextMessage(message))

})


app.listen(PORT, () => {   
  console.log(`Server running in ${MODE} mode on port ${PORT}`)
  bot.setWebhook("https://drab-ruby-piglet-hat.cyclic.app/viber/webhook")
})