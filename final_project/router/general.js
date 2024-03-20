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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    getAllBooks = new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });

    getAllBooks.then(
        (data) => res.status(200).json({ books: data }),
        (err) => res.status(300).json({ error: err })
    );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    searchISBN = new Promise((resolve, reject) => {
        try {
            resolve(books[req.params.isbn]);
        } catch (err) {
            reject(err);
        }
    });

    searchISBN.then(
        (data) => res.status(200).json(data),
        (err) => res.status(300).json({ error: err })
    );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    searchAuthor = new Promise((resolve, reject) => {
        try {
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
            resolve(booksbyauthor);
        } catch (err) {
            reject(err);
        }
    });

    searchAuthor.then(
        (data) => res.status(200).json({ booksbyauthor: data }),
        (err) => res.status(300).json({ error: err })
    );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    searchTitle = new Promise((resolve, reject) => {
        try {
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
            resolve(booksbytitle);
        } catch (err) {
            reject(err);
        }
    });

    searchTitle.then(
        (data) => res.status(200).json({ booksbytitle: data }),
        (err) => res.status(300).json({ error: err })
    );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    searchReview = new Promise((resolve, reject) => {
        try {
            resolve(books[req.params.isbn].reviews);
        } catch (err) {
            reject(err);
        }
    });

    searchReview.then(
        (data) => res.status(200).json(data),
        (err) => res.status(300).json({ error: err })
    );
});

module.exports.general = public_users;
