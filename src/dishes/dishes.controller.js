const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish })
}

function propertyValidationChecks(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (!name || name === "")
        return next({ status: 400, message: "Dish must include a name" });
    if (!description || description === "")
        return next({ status: 400, message: "Dish must include a description" });
    if (!price)
        return next({ status: 400, message: "Dish must include a price" });
    if (price <= 0 || price !== Number(price))
        return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" })
    if (!image_url || image_url === "")
        return next({ status: 400, message: "Dish must include a image_url" })
    else {
        return next();
    }
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.foundDish = foundDish
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist ${req.params.dishId}`
    })
}

function list(req, res) {
    res.json({ data: dishes })
}


function read(req, res) {
    res.json({ data: res.locals.foundDish })
}

const update = (req, res, next) => {
    const { dishId } = req.params;
    const originalId = res.locals.foundDish.id
    const { data: { id, name, price, description, image_url }, } = req.body;
    if (id && id !== dishId)
        return next({
            status: 400,
            message: `Dish id ${id} does not match dish id ${req.params.dishId}`,
        });

    res.locals.foundDish = {
        id: originalId,
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    res.json({ data: res.locals.foundDish });
};

module.exports = {
    dishExists,
    create: [propertyValidationChecks, create],
    list,
    read: [dishExists, read],
    update: [dishExists, propertyValidationChecks, update],
    dishExists,
}
