const {User} = require("../models")
const jwt = require("jsonwebtoken")

module.exports = async (req,res,next) => {
	const {Authorization} = req.cookies
	const [authType,token] = Authorization.split(' ')
	if(authType!=='Bearer' || !token)
		return res.status(400).json({errorMessage: "로그인 먼저"})
	try{
		const {id} = jwt.verify(token, "hold x to pay respects")
		const existUser = await User.findByPk(id)
		if(!existUser)
			return res.status(400).json({errorMessage: "로그인 먼저"})
		res.locals.user = existUser
		next()
	}catch(e){
		console.log(e)
		return res.status(400).json({errorMessage: "로그인 먼저"})
	}
}