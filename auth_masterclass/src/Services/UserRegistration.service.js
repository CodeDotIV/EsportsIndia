import User from "../Schemas/UserSchema.js";
import bcrypt from "bcrypt"

export const regsiterUser = async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      message: "user is already there"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    username,
    password: hashedPassword,
    email
  })
  await newUser.save()
  res.status(200).json({
    message: "user registration succesfull"
  })

}