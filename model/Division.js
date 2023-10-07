const mongoose = require('mongoose')

const divisionSchema = new mongoose.Schema({
  divisionName: { // values: global || ...
    type: String,
    required: true
  }
})

const Division = mongoose.model('division', divisionSchema)
module.exports = Division
