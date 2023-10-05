module.exports = {
  getSummaryPoint: (req, res) => {
    console.log(req.userData)
    res.status(200).json({error: false})
  }
}
