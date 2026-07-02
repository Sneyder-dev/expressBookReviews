const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username; // get username from request body
    const password = req.body.password; // get password from request body

    //Check if username and password were provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    //Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists!" });
    }

    //Register the new user
    users.push({ username, password});
    return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get all books using Promise callbacks
public_users.get('/promise/books', function (req, res) {
    const fetchBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);  // resolve with books data
        } else {
            reject("No books found!"); // reject if no books
        }
    });

    fetchBooks
        .then((data) => {
            res.send(JSON.stringify(data, null, 4)); // send books
        })
        .catch((err) => {
            res.status(404).json({ message: err }); // send error
        });
});

// Get all books using Async-Await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.send(JSON.stringify(response.data, null, 4)); // send books
    } catch (err) {
        res.status(404).json({ message: "Error fetching books!", error: err.message }); // ❌ send error
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // retrieve ISBN from req parameters
    const book = books[isbn]; // find book using ISBN as key

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // book found
    } else {
        res.status(404).json ({ message: "Book not found"}); // not found
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; // get author from URL
  const bookKeys = Object.keys(books); // get all keys from books object
  const booksByAuthor = []; // Array to store matching books

  // Iterate through all books
  bookKeys.forEach((key) => {
    if (books[key].author === author) { // check if author matches
        booksByAuthor.push(books[key]); // add the matching book to array
    }
  });

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4)); // book found 
  } else {
    res.status(404).json({ message: "No books found for this author!"}); // not found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; // get title from URL
  const bookKeys = Object.keys(books); // get all keys from books object
  const booksByTitle = []; // array to store the matching books

  // Iterate through all books
  bookKeys.forEach((key) => {
    if (books[key].title === title) { // check if title matches
        booksByTitle.push(books[key]); // add the matching book to array
    }
  });

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4)); // book found 
  } else {
    res.status(404).json({ message: "No books found with this title!"}); // not found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // get ISBN from URL
    const book = books[isbn]; // find the book using isbn

    if (book) {
        res.send(JSON.stringify(book.reviews, null, 4)); // Send reviews
    } else {
        res.status(404).json({ message: "Book not found"}); // Not found
    }
});

module.exports.general = public_users;
