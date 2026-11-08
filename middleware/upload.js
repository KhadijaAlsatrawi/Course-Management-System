const multer = require('multer');
const path = require('path');

 const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/uploads/users',
    filename: (req, file, cb) =>
      cb(null, req.params.userId + path.extname(file.originalname).toLowerCase())
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype))
});

module.exports = upload