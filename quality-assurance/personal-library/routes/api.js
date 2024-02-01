/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const LibraryManager = require("../controllers/LibraryManager");
const libraryManager = new LibraryManager();

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      libraryManager.getBooks((err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    })

    .post(function (req, res) {
      const title = req.body.title;
      libraryManager.createBook(title, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    })

    .delete(function (req, res) {
      libraryManager.deleteAllBooks((err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      const bookId = req.params.id;
      libraryManager.getBook(bookId, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    })

    .post(function (req, res) {
      const bookId = req.params.id;
      const comment = req.body.comment;
      libraryManager.addComment(bookId, comment, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      });
    })

    .delete(function (req, res) {
      const bookId = req.params.id;
      libraryManager.deleteBook(bookId, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      });
    });
};
