/**
 * Dependencies
 */
require("dotenv").config() // this lets use use the variables in .env file
require("./config/db.js") // brings in our db config. This brings in all the dependencies from db.js. This is done to separate out dependencies for clearer understanding
const express = require("express")
const morgan = require("morgan") //logger

const app = express()
const { PORT = 3013 } = process.env // same as -> const PORT = process.env.PORT || 3013; // use env.PORT if it returns real value else use 3013

// Bring in our model
const Book = require("./models/Book.js")




/**
 * Middleware
 */
// middleware tells express to use stuff mentioned with 'app.use' for every request. app.use takes in req, res and next and 'uses' the function inside it for every request like use console.log("this is middleware"), use morgan, use express.urlencoded
// app.use((req, res, next) => {
//     console.log("this is middleware")
//     next() // go to next middleware
// })
app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser, this is how we get access to req.body


/**
 * Routes and Router
 */

// INDEX route - GET to render all books

// NEW route - GET for the form to create a new book

// CREATE route - POST
app.post("/books", async (req, res) => {

    // checkbox in frontend returns 'on' if checkbox is ticked
    if (req.body.completed === "on") { 
        // if it is checked
        req.body.completed = true
    } else {
        // if not checked
        req.body.completed = false
    }

    let newBook = await Book.create(req.body)
    res.send(newBook)
})

// SHOW route - GET to render only one book

/**
 * Server listener
 */
app.listen(PORT, ()=> {console.log(`Listening to the sounds of ${PORT}`)})