const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // check if username exists in users array
    const validUser = users.find(user => user.username === username);
    return validUser !== undefined; // Returns true or false
}

const authenticatedUser = (username,password) => { 
    // check if username AND password match the records
    const validUser = users.find(user => 
    user.username === username && user.password === password
    );
    return validUser !== undefined; // returns true or false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username; //get username from the body
    const password = req.body.password; //get password from the body

    //Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!"});
    }

    //Check if username and password match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password"});
    }

    //Generate JWT token
    const accessToken = jwt.sign(
        { username: username },
        'access',
        { expiresIn: '1h' }
    );

    //Save token to session
    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({ message: "User successfully logged in!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
