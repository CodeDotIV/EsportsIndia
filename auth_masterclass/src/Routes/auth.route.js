import express from "express"
import { regsiterUser } from "../Services/UserRegistration.service.js";
import { generatecaptcha } from "../Services/Capcha.service.js";
import { validateCaptcha } from "../Middleware/captcha.middleware.js";


const router = express.Router();

router.post("/register", validateCaptcha ,regsiterUser);
router.get("/captcha", generatecaptcha);



export default router;