const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

// const homeRoute = require('./routes/home.route.js');
// const userRoute = require("./routes/user.route.js");
// const petRoute = require("./routes/pet.route.js");
// const imageRoute = require("./routes/image.route.js");
// const audioRoute = require("./routes/audio.route.js");
const authRoute = require('./routes/auth.route.js')
const customerRoute = require('./routes/customer.route');
const sellerRoute = require('./routes/seller.router.js');

// router.use("/", homeRoute);
router.use("/auth", authRoute);
router.use('/customer', customerRoute);
router.use('/seller',sellerRoute);
// router.use("/pet", petRoute);
// router.use("/image", imageRoute);
// router.use('/audio', audioRoute);

module.exports = router;
