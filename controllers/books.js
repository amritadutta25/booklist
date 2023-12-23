/**
 * DEPENDENCIES
 */

// if we want a 'no middleware approach', that is, remove the req.model in front of .Book like in line 30,  remove the below code from middleware section in server.js
// app.use((req, res, next) => {
//     req.model = {
//         Book,
//         seedData
//     }
//     console.log("this is middleware")
//     next()
// })
// and do this in this file - require ../models/Book.js file in here
// const Book = require("../models/Book.js")

/**
 * EXPORTS
 */
// export the async functions below
module.exports = {
    index,
    newForm,
    destroy,
    update,
    create,
    edit,
    show,
    seed
}

/**
 * Route Controllers
 */

// index route
async function index(req, res) {
    // find all books in mongodb
    let books = await req.model.Book.find({})
    // render all the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()  // display latest added book at the top
    }) 
}

// new route, but new is a reserved word in js already
async function newForm(req, res) {
    // render the create form
    res.render("new.ejs")
}  

// delete route, but delete is a reserved word already in js
async function destroy(req, res) {
    try {
        // Find a book and then delete
        let deletedBook = await req.model.Book.findByIdAndDelete(req.params.id)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
} 

// update route
async function update(req, res) {
    try {
        // handle the checkbox logic

    // ticked 'checkbox' from front end returns 'on', but based on our model schema 'completed' expects a boolean value so we reformat the 'completed' field value
    if (req.body.completed === "on") {
        req.body.completed = true
    } else {
        req.body.completed = false
    }

    // then find the book by id and update with the req.body
    //findByIdUpdate(id, data to update, options)
    let updatedBook = await req.model.Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    )

    // redirect to show route with the updated book
    res.redirect(`/books/${updatedBook._id}`)
    } catch (error) {
        res.send("something went wrong in this route")
    }
}

// create route
async function create(req, res) {
    try {
         // checkbox in frontend returns 'on' if checkbox is ticked, but based on our model schema 'completed' expects a boolean value so we reformat the 'completed' field value
        if (req.body.completed === "on") { 
            // if it is checked
            req.body.completed = true
        } else {
            // if not checked
            req.body.completed = false
        }

        let newBook = await req.model.Book.create(req.body)
        res.redirect("/books")  // send user back to index page after adding a new book

    } catch (err) {
        res.send(err)
    }
}

// edit route
async function edit(req, res) {
    try {
        // find the book to edit
        let foundBook = await req.model.Book.findByIdAndUpdate(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send(error)
    }
}

// show route
async function show(req, res) {
    // find a book by the '_id'
    let foundBook = await req.model.Book.findById(req.params.id)

    // render the book to show.ejs
    res.render("show.ejs", {book: foundBook})
}

// seed route
async function seed(req, res) {
    try {
        // delete everything in the database
        await Book.deleteMany({})
        // Create data in the database
        await Book.create(
            req.model.seedData
        )
        // redirect back to the index
        res.redirect("/books")
    } catch (error) {
        res.send("something went wrong with your seeds")
    }
}