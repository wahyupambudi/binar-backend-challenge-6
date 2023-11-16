const router = require("express").Router();
const articleRoute = require('../route/article.route')
const morgan = require("morgan");

router.use(morgan("dev"));
router.use('/article', articleRoute )

module.exports = router;
