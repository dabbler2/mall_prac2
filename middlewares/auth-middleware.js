const Users = require("../schema/user")
const jwt = require("jsonwebtoken")

module.exports = async (req,res,next) => {
	const {Authorization} = req.cookies
	const [authType,token] = Authorization.split(' ')
	if(authType!=='Bearer' || !token)
		return res.status(400).json({errorMessage: "로그인 먼저"})
	try{
		const {userId} = jwt.verify(token, "hold x to pay respects")
		const existUser = await Users.findById(userId)
		if(!existUser)
			return res.status(400).json({errorMessage: "로그인 먼저"})
		res.locals.user = existUser
		next()
	}catch(e){
		return res.status(400).json({errorMessage: "로그인 먼저"})
	}
}