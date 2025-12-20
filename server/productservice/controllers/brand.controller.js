const { StatusCodes } = require("http-status-codes");
const Brand = require("../models/brand");
const Product = require("../models/product");
const { NotFoundError, BadRequestError } = require("../errors");

const getAll = async (req, res, next) => {
  try {
    const brands = await Brand.find().populate("products", "name");
    res.status(StatusCodes.OK).json({
      brands,
      message: "Successfully",
      status: StatusCodes.OK, // Đã sửa từ BAD_REQUEST thành OK
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Cannot get brands",
      status: StatusCodes.BAD_REQUEST,
    });
  }
};

module.exports = {
  getAll,
};
