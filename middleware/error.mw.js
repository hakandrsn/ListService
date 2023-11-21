const errors = (err, req, res, next) => {
  if (err.status) {
    switch (err.status) {
      case 400:
        res.status(400).send({ message: err.message, code: err.status });
        break;
      case 401:
        res.status(401).send({ message: err.message, code: err.status });
        break;
      case 403:
        res.status(403).send({ message: err.message, code: err.status });
        break;
      case 404:
        res.status(404).send({ message: err.message, code: err.status });
        break;
      case 500:
        res.status(500).send({ message: err.message, code: err.status });
        break;
      default:
        res.status(500).send({ message: err.message, code: err.status });
        break;
    }
  }
  if (err.name) {
    switch (err.name) {
      case "ValidationError":
        res.status(400).send({ message: err.message, code: err.status });
        break;
      case "SequelizeValidationError":
        res.status(400).send({ message: err.message, code: err.status });
        break;
      case "SequelizeUniqueConstraintError":
        res.status(400).send({
          message: "Böyle isteklerde bulunmamalısın",
          code: err.status,
        });
        break;
      case "RequestError":
        res.status(400).send({ message: "İstek hatalı", code: err.status });
        break;
      case "SequelizeForeignKeyConstraintError":
        res
          .status(400)
          .send({ message: "Verilen id eşleştirilemedi", code: 490 });
        break;
      case "SequelizeDatabaseError":
        res
          .status(400)
          .send({ message: "Veritabanı hatası", code: err.status });
        break;
      default:
        res.status(500).send({ message: err.message, code: err.status });
        break;
    }
  }
  if (err.code) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        res.status(400).send({ message: err.message, code: err.status });
        break;
      default:
        res.status(500).send({ message: err.message, code: err.status });
        break;
    }
  }
  console.log(err);
  next();
};
module.exports = errors;
