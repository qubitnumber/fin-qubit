export const validate =
  (schema) =>
  async (req, res, next) => {
    try {
      await schema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      return next();
    } catch (err) {
      return res.status(400).json({
        status: 'fail',
        error: err.errors,
      });
    }
  };