/**
 * Dependencies
 */
const mongoose = require("mongoose")


// create a schema
const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    completed: Boolean
})

// compose our model from the schema
const Book = mongoose.model("Book", bookSchema)

// export model
module.exports = Book