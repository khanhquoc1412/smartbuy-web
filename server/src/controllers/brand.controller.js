const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { User, Product, Brand, sequelize, Category, Specification, ProductSpecification } = require('../database/models')
const { Op } = require("sequelize");
const { queryCondition } = require('../utils/queryCondition')
const { NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError } = require('../errors')

const getAll = async (req, res, next) => {
    try {
        const brands = await Brand.findAll({
            include: [
                {
                    model: Product, 
                    as: 'products',
                    attributes: ['name']
                }
            ]
        })

        res.status(StatusCodes.OK).json({
            brands,
            message: 'Successfully',
            status: StatusCodes.BAD_REQUEST
        })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Cannot get brands',
            status: StatusCodes.BAD_REQUEST
        })
    }
}

module.exports = {
    getAll
}