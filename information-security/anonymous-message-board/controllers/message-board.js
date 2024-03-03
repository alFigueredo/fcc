const { Thread, Reply } = require("../models/board");
const bcrypt = require("bcrypt");

class MessageBoard {
  submitThread = async (board, text, deletePassword, done) => {
    try {
      const delete_password = await bcrypt.hash(deletePassword, 10);
      const thread = new Thread({ board, text, delete_password });
      await thread.save();
      done(null);
    } catch (err) {
      done(err);
    }
  };

  submitReply = async (board, thread_id, text, deletePassword, done) => {
    try {
      const thread = await Thread.findById(thread_id);
      if (board !== thread.board) throw Error("Board does not match");
      const delete_password = await bcrypt.hash(deletePassword, 10);
      const reply = new Reply({ text, delete_password });
      await reply.save();
      thread.replies.push(reply);
      thread.bumped_on = reply.created_on;
      await thread.save();
      done(null);
    } catch (err) {
      done(err);
    }
  };

  getThreads = async (board, done) => {
    try {
      const threads = await Thread.find({ board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .select({
          reported: 0,
          delete_password: 0,
          replies: {
            reported: 0,
            delete_password: 0,
          },
        });
      const filteredThreads = threads.map((thread) => {
        return {
          ...thread._doc,
          replycount: thread.replies.length,
          replies: thread.replies.slice(-3),
        };
      });
      done(null, filteredThreads);
    } catch (err) {
      done(err);
    }
  };

  getReplies = async (board, thread_id, done) => {
    try {
      const thread = await Thread.findById(thread_id).select({
        reported: 0,
        delete_password: 0,
        replies: { reported: 0, delete_password: 0 },
      });
      if (board !== thread.board) throw Error("Board does not match");
      done(null, thread);
    } catch (err) {
      done(err);
    }
  };

  deleteThread = async (board, thread_id, delete_password, done) => {
    try {
      const thread = await Thread.findById(thread_id);
      if (board !== thread.board) throw Error("Board does not match");
      const result = await bcrypt.compare(
        delete_password,
        thread.delete_password,
      );
      if (result) {
        thread.replies.forEach(async (reply) => {
          await Reply.findByIdAndDelete(reply._id);
        });
        await thread.deleteOne();
        done(null, "success");
      } else {
        throw Error("incorrect password");
      }
    } catch (err) {
      done(err);
    }
  };

  deleteReply = async (board, thread_id, reply_id, delete_password, done) => {
    try {
      const thread = await Thread.findById(thread_id);
      if (board !== thread.board) throw Error("Board does not match");
      const reply = await Reply.findById(reply_id);
      if (!reply) throw Error("Reply does not exist");
      const result = await bcrypt.compare(
        delete_password,
        reply.delete_password,
      );
      if (result) {
        reply.text = "[deleted]";
        await reply.save();
        done(null);
        thread.replies = thread.replies.map((item) =>
          item._id.toString() === reply_id ? reply : item,
        );
        await thread.save();
      } else {
        throw Error("incorrect password");
      }
    } catch (err) {
      done(err);
    }
  };

  reportThread = async (board, thread_id, done) => {
    try {
      const thread = await Thread.findById(thread_id);
      if (board !== thread.board) throw Error("Board does not match");
      thread.reported = true;
      await thread.save();
      done(null);
    } catch (err) {
      done(err);
    }
  };

  reportReply = async (board, thread_id, reply_id, done) => {
    try {
      const thread = await Thread.findById(thread_id);
      if (board !== thread.board) throw Error("Board does not match");
      const reply = await Reply.findById(reply_id);
      if (!reply) throw Error("Reply does not exist");
      reply.reported = true;
      await reply.save();
      done(null);
    } catch (err) {
      done(err);
    }
  };
}

module.exports = MessageBoard;
