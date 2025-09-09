const { Order, Cart, OrderDetail, Product, Address, OrderStatus, ProductVariant, Color, Memory, Payment, PaymentMethod, PaymentStatus } = require('../database/models')
const { Op } = require("sequelize");
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../errors')
const { queryCondition } = require('../utils/queryCondition')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')


const createOrder = async (req, res, next) => {
    try {
        //test loading
        await new Promise(resolve => setTimeout(resolve, 500));

        const userId = req.id
        const {
            carts,
            address,
            addressUserId,
            paymentId,
            userName,
            phoneNumber
        } = req.body
        console.log(carts)

        let addressId = addressUserId
        if (!addressId) {
            const createAddress = await Address.create(address)
            addressId = createAddress.id
        }

        const createOrder = await Order.create({
            userId: userId,
            addressId: addressId,
            paymentId: paymentId,
            orderStatusId: 1,
            userName: userName,
            phoneNumber: phoneNumber
        })
        const orderDetailData = carts.map(cartItem => ({
            quantity: cartItem.quantity,
            productVariantId: cartItem.productVariant.id,
            userId: userId,
            orderId: createOrder.id
        }));
        const createdOrderDetails = await OrderDetail.bulkCreate(orderDetailData);

        //clear cart 
        Cart.destroy({
            where: {
                userId: userId
            }
        })
        res.status(StatusCodes.CREATED).json({
            message: "Đặt hàng thành công",
            status: StatusCodes.CREATED
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const createOrderGuest = async (req, res, next) => {
    try {
        //test loading
        await new Promise(resolve => setTimeout(resolve, 500));

        const {
            productVariantId,
            address,
            paymentId,
            quantity,
            userName,
            phoneNumber
        } = req.body

        const createAddress = await Address.create(address)
        const addressId = createAddress.id

        const createOrder = await Order.create({
            userId: 9999,
            addressId: addressId,
            paymentId: paymentId,
            orderStatusId: 1,
            userName: userName,
            phoneNumber: phoneNumber
        })
        const createdOrderDetails = await OrderDetail.create({
            quantity: quantity,
            productVariantId: productVariantId,
            userId: 9999,
            orderId: createOrder.id
        });

        res.status(StatusCodes.CREATED).json({
            message: "Đặt hàng thành công",
            status: StatusCodes.CREATED
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
}

const getUserOrders = async (req, res, next) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const userId = req.id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const sort = [['createdAt', 'DESC']];
        const { rows, count } = await Order.findAndCountAll({
            attributes: [
                'id',
                'userName',
                'phoneNumber',
                'userId',
                'createdAt'
            ],
            include: [
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: ProductVariant,
                            as: 'productVariant',
                            attributes: ['id', 'stock', 'price'],
                            include: [
                                {
                                    model: Color,
                                    as: 'color',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                },
                                {
                                    model: Memory,
                                    as: 'memory',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                },
                                {
                                    model: Product,
                                    as: 'product',
                                    attributes: [
                                        'id',
                                        'name',
                                        'description',
                                        'discountPercentage',
                                        'thumbUrl',
                                        'slug',
                                        'basePrice',
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: OrderStatus,
                    as: 'orderStatus',
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['id', 'province', 'district', 'ward']
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id'],
                    include: [
                        {
                            model: PaymentStatus,
                            as: 'paymentStatus',
                            attributes: ['name']
                        },
                        {
                            model: PaymentMethod,
                            as: 'paymentMethod',
                            attributes: ['name']
                        }
                    ]
                }
            ],
            where: { userId },
            order: [["createdAt", "desc"]],
            offset,
            limit,
            distinct: true,
        })

        totalPages = Math.ceil(count / limit);
        data = rows;
        total = count;
        return res.status(StatusCodes.OK).json({
            orders: data,
            total: totalPages,
            totalOrder: total,
            skip: offset,
            limit,
            page
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }

}
module.exports = {
    createOrder,
    getUserOrders,
    createOrderGuest
}