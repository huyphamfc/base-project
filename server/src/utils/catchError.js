module.exports = (func) => {
  const middlewareFunc = async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  return middlewareFunc;
};
