const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
        }
        return res.status(404).json({ message: "Customer already exists!" });
    }
    return res.status(404).json({ message: "Unable to register customer." });
});

/*
 * Task 10: Get all books – Using async callback function (2 pts)
 */

async function getAllBooks(callback) {
    try {
        callback(null, books);
    } catch (err) {
        callback(err, null);
    }
}

getAllBooks((err, books) => {
    if (err) return console.error(err);
    console.log(JSON.stringify(books));
});

/*
 * END OF TASK 10
 */

/*
 * Task 11: Search by ISBN – Using Promises (2 pts)
 */

function searchISBN(isbn) {
    return new Promise((resolve, reject) => {
        try {
            resolve(books[isbn]);
        } catch (err) {
            reject(err);
        }
    });
}

searchISBN(1).then(
    (data) => console.log(JSON.stringify(data)),
    (err) => console.error(err)
);

/*
 * END OF TASK 10
 */

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    let booksbyauthor = [];
    for (book in books) {
        if (books[book].author == author) {
            let bookInfo = {};
            bookInfo["isbn"] = book;
            bookInfo["title"] = books[book].title;
            bookInfo["reviews"] = books[book].reviews;
            booksbyauthor.push(bookInfo);
        }
    }
    return res.status(200).json({ booksbyauthor: booksbyauthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    let booksbytitle = [];
    for (book in books) {
        if (books[book].title == title) {
            let bookInfo = {};
            bookInfo["isbn"] = book;
            bookInfo["author"] = books[book].author;
            bookInfo["reviews"] = books[book].reviews;
            booksbytitle.push(bookInfo);
        }
    }
    return res.status(200).json({ booksbytitle: booksbytitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
