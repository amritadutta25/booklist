/**
 * Dependencies
 */
require("dotenv").config() // this lets use use the variables in .env file
require("./config/db.js") // brings in our db config. This brings in all the dependencies from db.js. This is done to separate out dependencies for clearer understanding
const express = require("express")
const morgan = require("morgan") //logger
const methodOverride = require("method-override")

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
app.use(methodOverride("_method")) // Lets us use DELETE PUT HTTP verbs 

/**
 * Routes and Router
 * INDUCES
 */

// INDEX route - GET to render all books
app.get("/books", async (req, res) => {
    // find all books in mongodb
    let books = await Book.find({})
    // render all the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()  // display latest added book at the top
    })
})

// NEW route - GET for the form to create a new book
app.get("/books/new", (req, res) => {
    // render the create form
    res.render("new.ejs")
})

// DELETE
app.delete("/books/:id", async (req, res) => {
    try {
        // Find a book and then delete
        let deletedBook = await Book.findByIdAndDelete(req.params.id)
        console.log(deletedBook)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
})

// CREATE route - POST
app.post("/books", async (req, res) => {

    try {
         // checkbox in frontend returns 'on' if checkbox is ticked
        if (req.body.completed === "on") { 
            // if it is checked
            req.body.completed = true
        } else {
            // if not checked
            req.body.completed = false
        }

        let newBook = await Book.create(req.body)
        res.redirect("/books")  // send user back to index page after adding a new book

    } catch (err) {
        res.send(err)
    }
})

//EDIT route - get the book to edit
app.get("/books/edit/:id", async (req, res) => {
    try {
        // find the book to edit
        let foundBook = await Book.findByIdAndUpdate(req.params.id)
        res.render("edit", {
            book:foundBook
        })
    } catch (error) {
        res.send(error)
    }
})

// SHOW route - GET to render only one book
app.get("/books/:id", async (req, res) => {
    // find a book by the '_id'
    let foundBook = await Book.findById(req.params.id)

    // render the book to show.ejs
    res.render("show.ejs", {book: foundBook})
})

/**
 * Server listener
 */
app.listen(PORT, ()=> {console.log(`Listening to the sounds of ${PORT}`)})