//******************
// BOOKS ROUTER
//******************

/**
 * DEPENDENCIES
 */
const express =  require("express")
const router = express.Router()

// bring in our controllers
const bookController = require("../controllers/books.js")


/**
 * ROUTES - INDUCESS (extra S for Seed route)
 */

// INDEX route - GET to render all books
router.get("/", bookController.index)   // we are importing async index function from ../controllers/books.js

// NEW route - GET for the form to create a new book
router.get("/new", bookController.newForm)

// DELETE
router.delete("/:id", bookController.destroy)

// UPDATE route
router.put("/:id", bookController.update )

// CREATE route - POST
router.post("/", bookController.create )

//EDIT route - get the book to edit
router.get("/edit/:id", bookController.edit )

// Seed - GET
// Seed route populates our databases with some dummy data
router.get("/seed", bookController.seed)

// SHOW route - GET to render only one book
router.get("/:id", bookController.show )

// Export the router
module.exports = router