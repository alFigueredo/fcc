const { Book } = require("../models/book");
const mongoose = require("mongoose");

function LibraryManager() {
  this.createBook = async (title, done) => {
    try {
      if (!title) throw "missing required field title";
      const book = new Book({
        title,
      });
      await book.save();
      done(null, book);
    } catch (err) {
      done(err);
    }
  };

  this.getBooks = async (done) => {
    try {
      const books = await Book.find();
      done(null, books);
    } catch (err) {
      done(err);
    }
  };

  this.getBook = async (bookId, done) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) throw "no book exists";
      const book = await Book.findById(bookId);
      if (!book) throw "no book exists";
      done(null, book);
    } catch (err) {
      done(err);
    }
  };

  this.addComment = async (bookId, comment, done) => {
    try {
      if (!comment) throw "missing required field comment";
      if (!mongoose.Types.ObjectId.isValid(bookId)) throw "no book exists";
      const book = await Book.findById(bookId);
      if (!book) throw "no book exists";
      book.comments.push(comment);
      book.commentcount = book.comments.length;
      await book.save();
      done(null, book);
    } catch (err) {
      done(err);
    }
  };

  this.deleteBook = async (bookId, done) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) throw "no book exists";
      const book = await Book.findByIdAndDelete(bookId);
      if (!book) throw "no book exists";
      done(null, "delete successful");
    } catch (err) {
      console.error(err);
      done(err);
    }
  };

  this.deleteAllBooks = async (done) => {
    try {
      const books = await Book.deleteMany();
      done(null, "complete delete successful");
    } catch (err) {
      done(err);
    }
  };
}

module.exports = LibraryManager;
