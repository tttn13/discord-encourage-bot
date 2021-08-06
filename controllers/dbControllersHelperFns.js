const Message = require("../models/Message");
const SadWord = require("../models/SadWords");
const Responding = require("../models/Responding");

exports.getRespondingStatus = async () => {
  try {
    const res = await Responding.findAll({ attributes: ["value"] });
    const status = res.map((item) => item.value);
    return status[0];
  } catch (error) {
    return {
      error: error,
      message: "Server is error",
    };
  }
};

exports.getSadWords = async () => {
  try {
    const allSadWords = await SadWord.findAll({ attributes: ["word"] });
    const sadWordsList = allSadWords.map((item) => item.word);
    return sadWordsList;
  } catch (error) {
    return {
      message: "Server is error",
    };
  }
};

exports.getAllMessages = async () => {
  try {
    // const allMessages = await Message.findAll({ attributes: ["message"] });
    const allMessages = await Message.findAll();
    const messageList = allMessages.map((item) => ({
      message: item.message,
      id: item.messageId,
    }));
    return messageList;
  } catch (error) {
    return {
      error: error,
      message: "Server is error",
    };
  }
};

exports.changeResponding = async ({ value }) => {
  try {
    const res = await Responding.findAll({ attributes: ["id"] });
    const foundid = res.map((item) => item.id)[0];
    await Responding.update({ value: value }, { where: { id: foundid } });
  } catch (error) {
    return {
      error: error,
      message: "Server is error",
    };
  }
};

exports.deleteMessage = async (id) => {
  console.log("fetching api, id is", id);
  try {
    // equivalent to: DELETE from tags WHERE messageId = ?;
    const delMessage = await Message.destroy({ where: { messageId: id } });
    if (!delMessage) return msg.reply("That message id did not exist");
  } catch (error) {
    return {
      error: error,
      message: "Server is error",
    };
  }
};

exports.addMessage = async (encourageMessage) => {
  try {
    const newMessage = await Message.create({
      message: encourageMessage,
    });
    msg.reply(`messsage \"${newMessage.message}\" added.`);
    return msg.channel.send("New message added");
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return msg.reply("That message already exists.");
    }
  }
};

exports.addWord = async (word) => {
  try {
    const newWord = await SadWord.create({
      word: word,
    });
    msg.reply(`word \"${newWord.word}\" added.`);
    return msg.channel.send("New word added");
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return msg.reply("That word already exists.");
    }
  }
};
