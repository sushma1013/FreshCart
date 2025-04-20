import express from "express";
import { signup, login, addUser,getUsers } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/add-user", addUser);
router.get("/users", getUsers);

export default router;
