//******************
// BOOKS ROUTER
//******************

/**
 * DEPENDENCIES
 */
const express =  require("express")
const router = express.Router()


/**
 * ROUTES - INDUCESS (extra S for Seed route)
 */

// INDEX route - GET to render all books
router.get("/", async (req, res) => {
    // find all books in mongodb
    let books = await req.model.Book.find({})
    // render all the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()  // display latest added book at the top
    })
})

// NEW route - GET for the form to create a new book
router.get("/new", (req, res) => {
    // render the create form
    res.render("new.ejs")
})

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        // Find a book and then delete
        let deletedBook = await req.model.Book.findByIdAndDelete(req.params.id)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
})

// UPDATE route
router.put("/:id", async (req, res) => {
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
})

// CREATE route - POST
router.post("/", async (req, res) => {

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
})

//EDIT route - get the book to edit
router.get("/edit/:id", async (req, res) => {
    try {
        // find the book to edit
        let foundBook = await req.model.Book.findByIdAndUpdate(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send(error)
    }
})

// Seed - GET
// Seed route populates our databases with some dummy data
router.get("/seed", async (req, res) => {
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
})

// SHOW route - GET to render only one book
router.get("/:id", async (req, res) => {
    // find a book by the '_id'
    let foundBook = await req.model.Book.findById(req.params.id)

    // render the book to show.ejs
    res.render("show.ejs", {book: foundBook})
})

// Export the router
module.exports = router