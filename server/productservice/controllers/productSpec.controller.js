// controllers/productSpecification.controller.js
const { StatusCodes } = require("http-status-codes");
const ProductSpecification = require("../models/product_specification");
const Product = require("../models/product");
const Specification = require("../models/specification");
const { NotFoundError, BadRequestError } = require("../errors");

// 📌 Lấy tất cả ProductSpecifications
const getAll = async (req, res) => {
  try {
    const specs = await ProductSpecification.find()
      .populate("productId", "name")
      .populate("specsId", "name");

    res.status(StatusCodes.OK).json({
      specs,
      total: specs.length,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// 📌 Lấy theo productId
const getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const specs = await ProductSpecification.find({ productId }).populate(
      "specsId",
      "name"
    );

    if (!specs.length)
      throw new NotFoundError("Không tìm thấy thông số sản phẩm");

    res.status(StatusCodes.OK).json(specs);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// 📌 Tạo mới ProductSpecification
const create = async (req, res) => {
  try {
    const { productId, specsId, specValue } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

    const spec = await Specification.findById(specsId);
    if (!spec) throw new NotFoundError("Thông số không tồn tại");

    const newSpec = await ProductSpecification.create({
      productId,
      specsId,
      specValue,
    });

    res.status(StatusCodes.CREATED).json(newSpec);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Không thể tạo ProductSpecification",
    });
  }
};

// 📌 Cập nhật ProductSpecification
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { specValue } = req.body;

    const updated = await ProductSpecification.findByIdAndUpdate(
      id,
      { specValue },
      { new: true }
    );

    if (!updated)
      throw new NotFoundError("Không tìm thấy ProductSpecification");

    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// 📌 Xóa ProductSpecification
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductSpecification.findByIdAndDelete(id);

    if (!deleted)
      throw new NotFoundError("Không tìm thấy ProductSpecification");

    res.status(StatusCodes.OK).json({
      message: "Xóa thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAll,
  getByProduct,
  create,
  update,
  remove,
};
