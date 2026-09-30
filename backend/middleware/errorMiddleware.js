const errorMiddleware = (err, req, res, next) => {
  console.log("Err", err.stack);

  res.status(500).json({
    message: "Something went wrong",
  });
};

export default errorMiddleware;
