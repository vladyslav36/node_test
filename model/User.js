const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  authKey: String,
  authMethod: String,
    token:String,
    userProfile: {},
  },
  {
    timestamps: true,
    minimize:false
  }
)

const User=mongoose.model('User_test',userSchema)

module.exports=User