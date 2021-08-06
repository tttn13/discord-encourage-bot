const express = require("express")
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.all("/", (req, res) => {
  res.send("Bot is running!")
})

function keepAlive() {
    //listen on a port
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}

module.exports = keepAlive