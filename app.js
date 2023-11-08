const express = require("express");
const app = express()
//const router = express.Router()
const cartsRouter = require('./routes/carts')
const registerRouter = require('./routes/users')
const goodsRouter = require('./routes/goods')
const cookieParser = require('cookie-parser')
const connect = require("./schema")
connect();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/api",[cartsRouter,goodsRouter,registerRouter]);
app.use(express.static("assets"))

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});