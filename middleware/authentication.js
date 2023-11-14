const jwt = require('jsonwebtoken')
const {JWT_KEY} = require("../config/env");
const User = require('../model/User')

const handleAuthenticationError = (error) => {
  if (error?.message.includes("jwt expired")) {
    return {
      status: 401,
      json: {error: true, message: "Sesi anda habis, silahkan untuk login ulang!"}
    }
  } else if (error?.message.includes("jwt must be provided")) {
    return {
      status: 400,
      json: {error: true, message: "Sesi tidak ditemukan!"}
    }
  }

  return {
    status: 500,
    json: {error: true, message: "Kesalahan dalam autentikasi, silahkan coba beberapa saat lagi!"}
  }
}

module.exports = {
  requireAdminOrMember: (req, res, next) => {
    try {
      const token = req.headers.authorization
          ? req.headers.authorization.replace('Bearer ', '')
          : null;

      const {data} = jwt.verify(token, JWT_KEY);

      User.findById(data._id)
          .populate('division')
          .then(r => {
            if (r) {
              const {position} = r
              req.userData = r;
              req.userType = position;

              next();
            } else {
              res.status(403).json({error: true, message: "Akses dibatasi!"})
            }
          })
          .catch(() =>
              res.status(500).json({
                error: true,
                message: "Gagal otorisasi user, silahkan coba beberapa saat lagi!"
              })
          )
    } catch (e) {
      const {status, json} = handleAuthenticationError(e)
      res.status(status).json(json)
    }
  },
  requireAdmin: (req, res, next) => {
    try {
      const token = req.headers.authorization
          ? req.headers.authorization.replace('Bearer ', '')
          : null;

      const {data} = jwt.verify(token, JWT_KEY);

      User.findById(data._id)
          .then(r => {
            if (r) {
              const {position} = r
              if (position === "admin") {
                req.userData = r;
                req.userType = position;

                next();
              } else {
                res.status(403).json({error: true, message: "Akses dibatasi!"})
              }
            } else {
              res.status(404).json({error: true, message: "User tidak valid, silahkan untuk login ulang!"})
            }
          })
          .catch(() =>
              res.status(500).json({
                error: true,
                message: "Gagal otorisasi user, silahkan coba beberapa saat lagi!"
              })
          )
    } catch (e) {
      const {status, json} = handleAuthenticationError(e)
      res.status(status).json(json)
    }
  }
}
