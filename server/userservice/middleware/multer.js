const multer = require('multer')

// SET STORAGE
const storage = multer.diskStorage({ // save in disk
  destination: function (req, file, cb) { // path root of img
    cb(null, 'src/uploads')
  },
  filename: function (req, file, cb) { // name file of imgs in path root
    cb(null, file.fieldname + '-' + Date.now())
  }
})

module.exports = multer({ storage: storage })