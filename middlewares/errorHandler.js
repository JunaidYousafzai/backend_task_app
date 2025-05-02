const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error Stack:\n", err.stack); 

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, 
  });
};

module.exports = errorHandler;
