require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { connectDB } = require("./server");
const {
  getAllMessages,
  getSadWords,
  getRespondingStatus,
  changeResponding,
  deleteMessage,
  addMessage,
  addWord
} = require("./controllers/dbControllersHelperFns");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL"],
});

const API_URL = "https://zenquotes.io/api/random";
const PREFIX = "$";

const showEncouragingMsg = async (messageObject) => {
  const res = await getAllMessages();
  const msgList = res.map(item => item.message)
  console.log(msgList)
  const encourageMessage = msgList[Math.floor(Math.random() * msgList.length)];
  return messageObject.reply(encourageMessage);
};

const getQuote = async () => {
  const response = await fetch(API_URL);
  let data = await response.json();
  return data[0]["q"] + "-" + data[0]["a"];
};

client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}!`);
  connectDB();
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "$inspire") {
    const quote = await getQuote();
    return msg.channel.send(quote);
  }

  const status = await getRespondingStatus();
  const sadWordsList = await getSadWords();
  console.log("this is current status", status);
  console.log('this is sad words', sadWordsList)
  const wordIsSad = sadWordsList.some((word) => msg.content.includes(word));
  if (wordIsSad && status) showEncouragingMsg(msg);

  //if message starts with $list, fetching all messages to get only the text part of the msg not the id by setting the attributes field
  if (msg.content.startsWith(`${PREFIX}list`)) {
    const allmessages = await getAllMessages();
    // const justMessages = (await allmessages.join("; ")) || "No messages set.";
    const msgEmbed = new Discord.MessageEmbed().setDescription(
      JSON.stringify(allmessages)
    );
    return msg.channel.send("This is the encouraging messages list", msgEmbed);
  }

  //if message starts with $newMessage
  const newCommand = `${PREFIX}newMessage`;
  if (msg.content.startsWith(newCommand)) {
    messageToSend = msg.content.slice(newCommand.length + 1);
    if (messageToSend.trim().length === 0) {
      return msg.channel.send("Please add a message.")
    } else {
      addMessage(messageToSend);
      return msg.channel.send("Added a message.");
    }
  }

  //if message starts with $newWord
  const newWordCommand = `${PREFIX}newWord`;
  if (msg.content.startsWith(newWordCommand)) {
    wordToSend = msg.content.slice(newWordCommand.length + 1);
    addWord(wordToSend);
    return msg.channel.send("Added a word.");
  }

  const delCommand = `${PREFIX}del`;
  if (msg.content.startsWith(delCommand)) {
    msgId = parseInt(msg.content.slice(delCommand.length + 1));
    deleteMessage(msgId);
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

client.login(process.env.BOT_TOKEN);
