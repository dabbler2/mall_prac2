const express = require("express")
const router = express.Router()
const {Op} = require("sequelize")
const {User} = require("../models/")
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/allusers', async(req,res) => {
	const userList = await User.findAll()
	res.json({userList})
})

router.post('/users', async(req,res) => {
	const {email,nickname,password,confirmPassword} = req.body
	if(password!==confirmPassword)
		return res.status(400).json({errorMessage: "확인 비번이 다름"})
	const alreadySameInfo = await User.findOne({where:{[Op.or]:[{email},{nickname}]}})
	if(alreadySameInfo)
		return res.status(400).json({errorMessage: "이미 해당 계정이 있음"})
	await User.create({email,nickname,password})
	res.json({})
})

router.post('/auth', async(req,res) => {
	const {email,password} = req.body
	const existUser = await User.findOne({where:{email}})
	//console.log(existUser)
	if(!existUser)
		return res.status(400).json({errorMessage: "해당 계정이 없음"})
	if(existUser.password!==password)
		return res.status(400).json({errorMessage: "비번이 다름"})
	const token = jwt.sign({id:existUser.dataValues.id}, "hold x to pay respects")
	res.cookie("Authorization",`Bearer ${token}`)
	res.status(200).json({token})
})

router.get('/users/me', authMiddleware, async(req,res) => {
	const {email,nickname} = res.locals.user
	res.json({user:{email,nickname}})
})

module.exports = router