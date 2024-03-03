"use strict";

const MessageBoard = require("../controllers/message-board");
const messageBoard = new MessageBoard();

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      const board = req.params.board.toLowerCase();
      const { text, delete_password } = req.body;
      messageBoard.submitThread(board, text, delete_password, (err) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).redirect(`/b/${board}/`);
        }
      });
    })
    .get((req, res) => {
      const board = req.params.board.toLowerCase();
      messageBoard.getThreads(board, (err, threads) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).json(threads);
        }
      });
    })
    .delete((req, res) => {
      const board = req.params.board.toLowerCase();
      const { thread_id, delete_password } = req.body;
      messageBoard.deleteThread(board, thread_id, delete_password, (err) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).send("success");
        }
      });
    })
    .put((req, res) => {
      const board = req.params.board.toLowerCase();
      const { thread_id } = req.body;
      messageBoard.reportThread(board, thread_id, (err) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).send("reported");
        }
      });
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      const board = req.params.board.toLowerCase();
      const { thread_id, delete_password, text } = req.body;
      messageBoard.submitReply(
        board,
        thread_id,
        text,
        delete_password,
        (err) => {
          if (err) {
            res.status(404).send(err.message);
          } else {
            res.status(200).redirect(`/b/${board}/${thread_id}/`);
          }
        }
      );
    })
    .get((req, res) => {
      const board = req.params.board.toLowerCase();
      const thread_id = req.query.thread_id;
      messageBoard.getReplies(board, thread_id, (err, thread) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).json(thread);
        }
      });
    })
    .delete((req, res) => {
      const board = req.params.board.toLowerCase();
      const { thread_id, reply_id, delete_password } = req.body;
      messageBoard.deleteReply(
        board,
        thread_id,
        reply_id,
        delete_password,
        (err) => {
          if (err) {
            res.status(404).send(err.message);
          } else {
            res.status(200).send("success");
          }
        }
      );
    })
    .put((req, res) => {
      const board = req.params.board.toLowerCase();
      const { thread_id, reply_id } = req.body;
      messageBoard.reportReply(board, thread_id, reply_id, (err) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.status(200).send("reported");
        }
      });
    });
};
