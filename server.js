/**
 * Dependencies
 */
require("dotenv").config() // this lets use use the variables in .env file
require("./config/db.js") // brings in our db config. This brings in all the dependencies from db.js. This is done to separate out dependencies for clearer understanding
const express = require("express")
const morgan = require("morgan") //logger
const methodOverride = require("method-override")
const booksRouter = require("./routes/books.js")

const app = express()
const { PORT = 3013 } = process.env // same as -> const PORT = process.env.PORT || 3013; // use env.PORT if it returns real value else use 3013

// Bring in our model
const Book = require("./models/Book.js")
const seedData = require("./models/seed.js")



/**
 * Middleware
 */

// middleware tells express to use stuff mentioned with 'app.use' for every request. app.use takes in req, res and next and 'uses' the function inside it for every request like use console.log("this is middleware"), use morgan, use express.urlencoded
// app.use((req, res, next) => {
//     console.log("this is middleware")
//     next() // go to next middleware
// })

// for every route, on the request object (req), add a custom object that will give access to Book model, seedData model
// this lets us access the two models in ./routes/books.js
app.use((req, res, next) => {
    req.model = {
        Book,
        seedData
    }
    console.log("this is middleware")
    next()
})

app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser, this is how we get access to req.body
app.use(methodOverride("_method")) // Lets us use DELETE PUT HTTP verbs 
app.use("/public", express.static("public")) // serves our public directory with the url prefix of /public/styles.css. Public directory contains static assets like CSS styling file. You add this public.styles.css file in head.ejs file so that the css style is applied to all ejs files (ejs files render the HTML)

/**
 * Routes and Router
 * INDUCES
 */
// app.use(prefix url, router to execute)
// tells server to start every route with "/books" followed by the specific routes present in  each route in "./routes/book.js"
app.use("/books", booksRouter)

/**
 * Server listener
 */
app.listen(PORT, ()=> {console.log(`Listening to the sounds of ${PORT}`)})