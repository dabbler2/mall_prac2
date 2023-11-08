const mongoose = require("mongoose")

const connect = () => {
	mongoose.connect("mongodb://localhost:27017/shopping-demo")
	.then(res => console.log("Mongodb OK"))
	.catch(e => console.log("Mongodb not OK"))
}

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;