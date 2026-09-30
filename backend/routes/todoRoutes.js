import express from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getTodos);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export default router;
