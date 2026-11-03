const isStudent = (req, res, next) => {
  if (req.session.user.role === 'student') return next();
  res.redirect("/");
};

module.exports = isStudent;
