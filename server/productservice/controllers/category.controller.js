const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category");
const { NotFoundError } = require("../errors");

// 📌 Lấy tất cả Category
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(StatusCodes.OK).json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// 📌 Lấy 1 Category theo id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) throw new NotFoundError("Danh mục không tồn tại");

    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// 📌 Tạo Category
const create = async (req, res) => {
  try {
    const { name, nameAscii } = req.body;

    if (!name || !nameAscii) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Tên và nameAscii là bắt buộc",
      });
    }

    const category = await Category.create({ name, nameAscii });

    res.status(StatusCodes.CREATED).json({
      category,
      message: "Tạo danh mục thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Không thể tạo danh mục",
    });
  }
};

// 📌 Cập nhật Category
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameAscii } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, nameAscii },
      { new: true }
    );

    if (!category) throw new NotFoundError("Không tìm thấy danh mục");

    res.status(StatusCodes.OK).json({
      category,
      message: "Cập nhật danh mục thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// 📌 Xóa Category
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) throw new NotFoundError("Không tìm thấy danh mục");

    res.status(StatusCodes.OK).json({
      message: "Xóa danh mục thành công",
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
  getById,
  create,
  update,
  remove,
};
