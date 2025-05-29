import svgCaptcha from "svg-captcha"

export const generatecaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    ignoreChars: "0oli1",
    color: true,
    noise: 2
  });
  req.session.captcha = captcha.text;

  console.log(captcha.text)

  res.type("svg")
  res.send(captcha.data)
}
