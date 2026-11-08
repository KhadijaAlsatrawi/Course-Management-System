const isOwner = (req, res, next) => {
  if (String(req.session.user._id) === String(req.params.userId)) return next();
  res.redirect("/");
};

module.exports = isOwner;
