const jwt = require("jsonwebtoken");
const {JWT_KEY, GOOGLE_WEB_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL} = require("../../config/env");
const User = require("../../model/User");

module.exports = {
  actionUserAuthGoogle: (req, res) => {
    const {code} = req.body;

    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_WEB_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URL
    );

    // Sign token for API calls from frontend
    const signToken = (data) => {
      const sessionToken = jwt.sign({data}, JWT_KEY, {
        expiresIn: 7 * 24 * 60 * 60
      })

      return res.status(200).json({
        error: false,
        data: {
          userToken: sessionToken,
          userData: data
        }
      })
    }

    const updateUserData = (id, name, picture) => {
      User.findByIdAndUpdate(id, {
        userName: name, profilePicture: picture
      }, {new: true})
          .populate('division')
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

    const handleResultGoogleApi = (data) => {
      const {email, name, picture} = data

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

    oauth2Client.getToken(code)
        .then(r => {
          const {tokens} = r

          oauth2Client.setCredentials({access_token: tokens.access_token});

          const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
          });

          oauth2.userinfo.get()
              .then(r => handleResultGoogleApi(r.data))
              .catch(() => res.status(500).json({
                error: true,
                message: "Gagal mendapatkan data user, silahkan coba beberapa saat lagi!"
              }))
        })
        .catch(() => res.status(500).json({
          error: true,
          message: "Gagal mendapatkan token, silahkan coba beberapa saat lagi!"
        }))
  },
  getUserData: (req, res) => {
    res.status(200).json({error: false, data: req.userData})
  }
}
