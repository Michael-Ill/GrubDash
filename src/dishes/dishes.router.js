const router = require("express").Router({mergeParams: true});
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./dishes.controller")

router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

// TODO: Implement the /dishes routes needed to make the tests pass

module.exports = router;
