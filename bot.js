require("dotenv").config();
const db = require("./database/db");
const keepAlive = require("./server")
const Message = require("./models/Message");
const SadWord = require("./models/SadWords");
const Responding = require('./models/Responding')
const Discord = require("discord.js");
const fetch = require("node-fetch"); 

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL"],
});

const API_URL = "https://zenquotes.io/api/random";
const PREFIX = "$";

const getRespondingStatus = async () => {
    const res  = await Responding.findAll({ attributes: ["value"] })
    const status = res.map((item) => item.value);
    return status[0]
};

const changeResponding = async ({ value }) => {
    const res = await Responding.findAll({ attributes: ["id"] })
    const foundid = res.map((item) => item.id)[0];
    const affectedRow = await Responding.update({ value: value}, { where: { id: foundid } })
};

const getSadWords = async () => {
  const allSadWords = await SadWord.findAll({ attributes: ["word"] });
  const sadWordsList = allSadWords.map((item) => item.word);
  return sadWordsList;
};

const getAllMessages = async () => {
  const allMessages = await Message.findAll({ attributes: ["message"] });
  const messageList = allMessages.map((item) => item.message);
  return messageList;
};

const showEncouragingMsg = async (messageObject) => {
  const res = await getAllMessages();
  const encourageMessage = res[Math.floor(Math.random() * res.length)];
  return messageObject.reply(encourageMessage);
};

const getQuote = async () => {
  const response = await fetch(API_URL);
  let data = await response.json();
  return data[0]["q"] + "-" + data[0]["a"];
};

client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}!`);
  db.authenticate()
    .then(() => {
      console.log("logged in to db");
      Message.init(db);
      SadWord.init(db);
      Responding.init(db);
      //create tables if not existed
      Message.sync();
      SadWord.sync();
      Responding.sync();
    })
    .catch((err) => console.log(err));
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "$inspire") {
    const quote = await getQuote();
    return msg.channel.send(quote);
  }

  const status = await getRespondingStatus();
  const sadWordsList = await getSadWords();
  const wordIsSad = sadWordsList.some((word) => msg.content.includes(word));
  console.log('this is current status', status)
  if (wordIsSad && status) showEncouragingMsg(msg);

  //if message starts with $list, fetching all messages to get only the text part of the msg not the id by setting the attributes field
  if (msg.content.startsWith(`${PREFIX}list`)) {
    const allmessages = await getAllMessages();
    const messageList = (await allmessages.join("; ")) || "No messages set.";
    return msg.channel.send(messageList);
  }

  //if message starts with $newMessage
  const newCommand = `${PREFIX}newMessage`;
  if (msg.content.startsWith(newCommand)) {
    try {
      messageToSend = msg.content.slice(newCommand.length + 1);
      const newMessage = await Message.create({
        message: messageToSend,
      });
      msg.reply(`messsage \"${newMessage.message}\" added.`);
      return msg.channel.send("New message added");
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return msg.reply("That message already exists.");
      }
      return msg.channel.send("Something went wrong with adding a message.");
    }
  }

  //if message starts with $newWord
  const newWordCommand = `${PREFIX}newWord`;
  if (msg.content.startsWith(newWordCommand)) {
    try {
      wordToSend = msg.content.slice(newWordCommand.length + 1);
      const newWord = await SadWord.create({
        word: wordToSend,
      });
      msg.reply(`word \"${newWord.word}\" added.`);
      return msg.channel.send("New word added");
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return msg.reply("That word already exists.");
      }
      return msg.channel.send("Something went wrong with adding a word.");
    }
  }

  const delCommand = `${PREFIX}del`;
  if (msg.content.startsWith(delCommand)) {
    msgId = parseInt(msg.content.slice(delCommand.length + 1));
    // equivalent to: DELETE from tags WHERE messageId = ?;
    const delMessage = await Message.destroy({ where: { messageId: msgId } });
    if (!delMessage) return msg.reply("That message id did not exist");
    return msg.channel.send("Message deleted");
  }

  const respondCommand = `${PREFIX}responding`;
  if (msg.content.startsWith(respondCommand)) {
    value = msg.content.slice(respondCommand.length + 1);
    if (value.toLowerCase() == "on") {
      changeResponding({ value: 1 });
      msg.channel.send("Responding is on");
    } else {
      changeResponding({ value: 0 });
      msg.channel.send("Responding is off");
    }
  }
});

keepAlive()
client.login(process.env.BOT_TOKEN);
