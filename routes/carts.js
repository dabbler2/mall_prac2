const express = require("express");
const router = express.Router();
const Cart = require("../schema/cart.js");
const Goods = require("../schema/goods.js");
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/goods/cart', authMiddleware, async(req,res) => {
	const {userId} = res.locals.user
	const cart = await Cart.find({userId})
	try{
		const carts = await Promise.all(cart.map(async x => {
			const {quantity,goodsId} = x
			const goods = await Goods.findOne({goodsId})
			return {quantity,goods}
		}))
		res.json({carts})
	}catch(e){
		console.log(e)
		return res.status(400).json({errorMessage: "뭔가 없는듯"})
	}
})

router.post('/goods/:goodsId/cart', authMiddleware, async(req,res) => {
	const {userId} = res.locals.user
	const {goodsId} = req.params
	const {quantity} = req.body
	const existCart = await Cart.findOne({userId,goodsId})
	if(existCart)
		return res.status(400).json({errorMessage: "카트에 이미 있음"})
	await Cart.create({userId,goodsId,quantity})
	res.json({message: "카트에 잘 담김"})
})

router.put('/goods/:goodsId/cart', authMiddleware, async(req,res) => {
	const {userId} = res.locals.user
	const {goodsId} = req.params
	const {quantity} = req.body
	try{
		await Cart.findOneAndUpdate({userId,goodsId},{quantity})
	}catch(e){
		return res.status(400).json({errorMessage: "뭔가 없는듯"})
	}
})

router.delete('/goods/:goodsId/cart', authMiddleware, async(req,res) => {
	const {userId} = res.locals.user
	const {goodsId} = req.params
	try{
		await Cart.findOneAndDelete({userId,goodsId})
	}catch(e){
		return res.status(400).json({errorMessage: "뭔가 없는듯"})
	}
})

/* router.get("/carts", async(req,res) => {
    const carts = await Cart.find({});
    // [
    //  {goodsId, quantity},
    //  {goodsId, quantity},
    // ];
    const goodsIds = carts.map((cart) => {
        return cart.goodsId;
    })
    // [2, 11, 19];

    const goods = await Goods.find({goodsId: goodsIds});
    // Goods에 해당하는 모든 정보를 가지고 올건데,
    // 만약 goodsIds 변수 안에 존재하는 값일 때에만 조회하라.

    const results = carts.map((cart) => {
        return {
            "quantity": cart.quantity,
            "goods": goods.find((item) => item.goodsId === cart.goodsId),
        }
    })

    res.json({
        "carts": results,
    })

}); */



module.exports = router;