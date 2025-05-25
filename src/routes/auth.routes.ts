import register, { register1 } from "../controllers/authControllers/register";
import login, { login1 } from "../controllers/authControllers/login";
import express from "express";


const router = express.Router()

router
.post("/sign-up", register)
.post("/sign-in", login)


const router1 = express.Router()
router1
.post("/sign-up", register1)
.post("/sign-in", login1)

export { router1 as authRoutes1 }
export { router as authRoutes }


// export default router
