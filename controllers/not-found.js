exports.getNotFound = (req, res) => {
  res.status(404).render('not-found', { docTitle: "Page not found", path: '', isAuth: req.session.isLoggedIn });
}