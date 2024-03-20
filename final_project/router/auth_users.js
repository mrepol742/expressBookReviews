const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let isUserAlreadExist = users.filter((user) => {
        return user.username === username;
    });
    if (isUserAlreadExist.length > 0) return true;
    return false;
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validusers.length > 0) return true;
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("Customer successfully logged in");
    }
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (review) {
        for (book in books) {
            if (book == isbn) {
                books[book].reviews[username] = review;
            }
        }
        return res.status(200).send("The review for the book with ISBN " + isbn + " has been Added/Updated.");
    }
    for (book in books) {
        if (book == isbn) {
            delete books[book].reviews[username];
        }
    }
    return res.status(200).send("Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
