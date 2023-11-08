const express = require("express");
const router = express.Router();
const Cart = require("../schema/cart.js");
const Goods = require("../schema/goods.js")

//상품 목록 조회 API
router.get("/goods", async(req, res) => {
	const {category} = req.query
	const goods = await Goods.find(category? {category}:{})
	res.json({goods});
});

// 상품 등록
router.post("/goods", async(req,res) => {
	const {goodsId,name,thumbnailUrl,category,price} = req.body
	const existsGoods = await Goods.findOne({ goodsId });
	if (existsGoods)
		return res.status(400).json({errorMessage: "중복임"})
	try{
		await Goods.create({goodsId,name,thumbnailUrl,category,price})
		res.status(200).json({ success: true });
	}catch(e){
		return res.status(400).json({errorMessage: "중복임"})
	}
})

// 상품 상세 조회
router.get("/goods/:goodsId", async(req, res) => {
	const { goodsId } = req.params;
	const existGoods = await Goods.findOne({ goodsId });
	if(!existGoods)
		return res.status(400).json({errorMessage: "그런거 없음"})
	res.json({goods:existGoods})
});

/*

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      { goodsId: goodsId },
      { $set: { quantity: quantity } }
    )
  }
  res.status(200).json({ success: true });
})

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: "success" });
})

router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다."
    });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
}) */

module.exports = router;