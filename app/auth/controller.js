const jwt = require("jsonwebtoken");
const {JWT_KEY} = require("../../config/env");
const User = require("../../model/User");
const axios = require("axios");

module.exports = {
  actionUserAuthGoogle: (req, res) => {
    const {idToken} = req.body;

    // Sign token for API calls from frontend
    const signToken = (data) => {
      const sessionToken = jwt.sign({data}, JWT_KEY, {
        expiresIn: 7 * 24 * 60 * 60
      })

      return res.status(200).json({error: false, data: {token: sessionToken}})
    }

    const updateUserData = (id, name, picture) => {
      User.findByIdAndUpdate(id, {
        userName: name, profilePicture: picture
      }, {new: true})
          .then((r) => {
            signToken(r)
          })
          .catch(() =>
              res.status(500).json({
                error: true,
                message: "Gagal mengubah data user, silahkan coba beberapa saat lagi!"
              })
          )

    }

    const handleResultGoogleApi = (result) => {
      const {email, name, picture} = result

      const checkEmailDomain = (email) => email.split("@")[1].includes("ittelkom-sby.ac.id")

      User.findOne({email})
          .then(r => {
            // If user found in database
            if (r) {
              const {_id} = r;
              // Update user data to sync latest data from google api
              return updateUserData(_id, name, picture)
            }

            // If user email domain from ITTelkom Surabaya
            if (checkEmailDomain(email)) {
              res.status(404).json({
                error: true,
                message: "Email anda tidak terdaftar di sistem kami!"
              })
            } else {
              res.status(403).json({
                error: true,
                message: "Email anda bukan dari ITTelkom Surabaya! mohon untuk login dengan akun Google dari ITTelkom Surabaya."
              })
            }
          })
          .catch(() =>
              res.status(500).json({
                error: true,
                message: "Gagal mencari data user, silahkan coba beberapa saat lagi!"
              })
          )
    }

    axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
        .then(r => {
          return handleResultGoogleApi(r.data)
        })
        .catch(() =>
            res.status(500).json({
              error: true,
              message: "Gagal melakukan request ke Google, silahkan coba login ulang!"
            })
        )
  }
}
