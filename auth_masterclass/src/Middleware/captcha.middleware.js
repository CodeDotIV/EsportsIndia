export const validateCaptcha = (req, res, next) => {
  const { captcha } = req.body;

  if (!req.session.captcha) {
    return res.status(400).json({
      message: "Captcha has expired. Please try again.",
    });
  }

  if (req.session.captcha !== captcha) {
    return res.status(400).json({
      message: "Invalid captcha. Please try again.",
    });
  }


  req.session.captcha = null;

  next();
};
