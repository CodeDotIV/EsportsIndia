import crypto from "crypto"

export default generateCsrfToken = (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex")
  }
  req.status(200), json({
    CSRF token
  })
}
