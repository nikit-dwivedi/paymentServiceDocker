//--------------------------------------------------modules-------------------------------------------------//
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
//--------------------------------------------------helpers-------------------------------------------------//
const { forbidden, unauthorized } = require('../helpers/response_helper');



//-------------------------------------------------privateKey----------------------------------------------//
// const partnerPrivateKEY = fs.readFileSync("./key/partner.private.pem", "utf8");
// const userPrivateKEY = fs.readFileSync("./key/user.private.pem", "utf8");
// const sellerPrivateKEY = fs.readFileSync("./key/seller.private.pem", "utf8");

//--------------------------------------------------publicKey----------------------------------------------//
// const partnerPublicKEY = fs.readFileSync("./key/partner.public.pem", "utf8");
// const sellerPublicKEY = fs.readFileSync("./key/seller.public.pem", "utf8");
// const userPublicKEY = fs.readFileSync("./key/user.public.pem", "utf8");

//--------------------------------------------------options-------------------------------------------------//
const signOption = { expiresIn: "30 days", algorithm: "PS256" };
const verifyOption = { expiresIn: "30 days", algorithm: ["PS256"] };



//--------------------------------------------------generate------------------------------------------------//
const generateUserToken = (user) => {
  const data = {
    userId: user.userId,
    customerId: customerId,
    username: user.username,
    role: 0,
  };
  return jwt.sign(data, userPrivateKEY, signOption);
};
const generatePartnerToken = (user) => {
  const data = {
    userId: user.userId,
    partnerId: user.partnerId,
    email: user.email,
    role: 1,
  };
  return jwt.sign(data, partnerPrivateKEY, signOption);
};

const generateSellerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 2,
    subRole: 2
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateSubSellerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 2,
    subRole: 1
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateAdminToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 777,
    subRole: 777
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateManagerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 10,
    subRole: 3
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateOpsManagerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 10,
    subRole: 2
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateDeliveryManagerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 10,
    subRole: 1
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateOpsSubManagerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 4,
    subRole: 2
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};
const generateDeliverySubManagerToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 4,
    subRole: 1
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};

// ------------------------------------------------authenticate------------------------------------------------//

function authenticatePartner(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, partnerPublicKEY, verifyOption);
      next();
    } catch (err) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticateUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.userRole == 2) {
        jwt.verify(token, partnerPublicKEY, verifyOption);
        next();
      } else if (decode.userRole == 1) {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, userPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticateSeller(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader)

      const token = authHeader.split(" ")[1];
      if (decode.userRole == 2) {
        jwt.verify(token, partnerPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");;
  }
}

function parseJwt(data) {
  try {
    let token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64");
    const toString = decode.toString();
    return JSON.parse(toString);
  } catch (e) {
    return null;
  }
}

async function encryption(data) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

async function checkEncryption(data, encryptData) {
  const check = await bcrypt.compare(data, encryptData);
  return check;
}

module.exports = {
  generateSellerToken,

  generateUserToken,
  authenticateUser,
  generatePartnerToken,

  parseJwt,
  encryption,
  checkEncryption,
};