const router = require("express").Router();
const {
  getAllMessages,
  getSadWords,
  getRespondingStatus,
  changeResponding,
  deleteMessage,
} = require("../controllers/dbControllersHelperFns");

router.route("/").get((req, res) => {
  return res.json({ message: "Bot is running!" });
});

router.route("/messages").get(async (req, res) => {
  const allmsgs = await getAllMessages();
  return res.status(200).json(allmsgs);
});

router.route("/sadwords").get(async (req, res) => {
  const allmsgs = await getSadWords();
  return res.status(200).json(allmsgs);
});
router.route("/responding").get(async (req, res) => {
  const allmsgs = await getRespondingStatus();
  return res.status(200).json(allmsgs);
});
router.route("/del/:id").delete(async (req, res) => {
  const id = req.params.id;
  await deleteMessage(id);
  return res.status(200).json({ message: "message deleted" });
});

router.route("/responding/:value").put(async (req, res) => {
    const newVal = req.params.value;
    await changeResponding({ value: newVal});
    return res.status(200).json({ message: "responding status changed" });
});

module.exports = router;
