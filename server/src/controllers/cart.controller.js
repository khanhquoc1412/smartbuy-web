const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Cart, User, Product, Brand, sequelize, Category, Specification, ProductSpecification, ProductVariant, Color, Memory } = require('../database/models')
const { Op } = require("sequelize");
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../errors')
const addProductToCart = async (req, res, next) => {
    try {
        // test loading FE
        await new Promise(resolve => setTimeout(resolve, 500));

        const { productVariantId, userId } = req.body
        if (!productVariantId || !userId) {
            throw new BadRequestError('Không xác định')
        }
        const cartItemExist = await Cart.findOne({
            where: {
                productVariantId: productVariantId,
                userId: userId
            }
        })
        if (cartItemExist) {
            cartItemExist.quantity = cartItemExist.quantity + 1;
            await cartItemExist.save();
            return res.status(StatusCodes.CREATED).json({
                message: 'Thêm thành công',
                status: StatusCodes.CREATED,
                cartItem: cartItemExist
            })
        }
        const cartItem = await Cart.create({
            productVariantId: productVariantId,
            userId: userId
        })

        res.status(StatusCodes.CREATED).json({
            message: 'Thêm thành công',
            status: StatusCodes.CREATED,
            cartItem
        })
    } catch (error) {
        console.log(error)
        if (error instanceof BadRequestError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const getUserCarts = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { rows, count } = await Cart.findAndCountAll({
            attributes: ['id', 'quantity'],
            include: [
                {
                    model: ProductVariant,
                    as: 'productVariant',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'colorId', 'memoryId']
                    },
                    include: [
                        {
                            model: Color,
                            as: 'color',
                            attributes: ['name', 'code']
                        },
                        {
                            model: Memory,
                            as: 'memory',
                            attributes: ['ram', 'rom']
                        },
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'thumbUrl', 'basePrice', 'discountPercentage', 'slug']
                        }
                    ]
                }
            ],
            where: {
                userId: userId
            }
        })

        res.status(StatusCodes.CREATED).json({
            carts: rows,
            totalItem: count
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const decreaseQuantity = async (req, res, next) => {
    try {
        const { cartId } = req.params
        const userId = req.id

        if (!cartId || !userId) {
            throw new BadRequestError('Không xác định')
        }
        const cartItemExist = await Cart.findOne({
            where: {
                id: cartId,
                userId: userId
            }
        })
        if (!cartItemExist) {
            throw new NotFoundError('Không thể thực hiện')

        }
        if (cartItemExist.quantity <= 1) {
            await Cart.destroy({
                where: {
                    id: cartId,
                    userId: userId
                }
            })
            return res.status(StatusCodes.OK).json({
                message: 'Xóa thành công',
                status: StatusCodes.OK,
            })
        }
        cartItemExist.quantity = cartItemExist.quantity - 1;
        await cartItemExist.save();
        res.status(StatusCodes.CREATED).json({
            message: 'Cập nhật thành công',
            status: StatusCodes.CREATED,
        })
    } catch (error) {
        console.log(error)
        if (error instanceof BadRequestError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}
const removeProduct = async (req, res, next) => {
    try {

        const { cartId } = req.params
        const userId = req.id
        if (!cartId) {
            throw new BadRequestError('Không thể thực hiện')
        }

        await Cart.destroy({
            where: {
                id: cartId,
                userId: userId
            }
        })
        return res.status(StatusCodes.OK).json({
            message: 'Xóa thành công',
            status: StatusCodes.OK,
        })
    } catch (error) {
        console.log(error)
        if (error instanceof BadRequestError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

module.exports = {
    addProductToCart,
    getUserCarts,
    removeProduct,
    decreaseQuantity
}