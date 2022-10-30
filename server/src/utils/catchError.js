module.exports = (func) => {
  const middlewareFunc = async (req, res, next) => {
    try {
      await func(req, res);
    } catch (err) {
      next(err);
    }
  };

  return middlewareFunc;
};
