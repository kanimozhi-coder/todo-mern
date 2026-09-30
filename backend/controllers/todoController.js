import Todo from "../models/Todo.js";

const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const todo = await Todo.create({
      title,
      user: req.user.userId,
    });

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({
      user: req.user.userId,
    });

    res.status(200).json({
      todos,
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    console.log("todo", todo);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (title !== undefined) {
      todo.title = title;
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();

    res.status(200).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createTodo, getTodos, updateTodo, deleteTodo };
