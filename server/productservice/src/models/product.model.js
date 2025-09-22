const mongoose = require('mongoose')
const slugify = require('slugify')

const ColorSchema = new mongoose.Schema({
	name: { type: String },
	code: { type: String }
}, { _id: false })

const MemorySchema = new mongoose.Schema({
	ram: { type: String },
	rom: { type: String },
	chipset: { type: String }
}, { _id: false })

const ProductVariantSchema = new mongoose.Schema({
	stock: { type: Number, default: 0 },
	price: { type: Number, required: true },
	color: { type: ColorSchema },
	memory: { type: MemorySchema }
}, { _id: true, timestamps: true })

const ProductImageSchema = new mongoose.Schema({
	name: { type: String },
	imageUrl: { type: String, required: true },
	originalName: { type: String },
	fileSize: { type: Number }
}, { _id: true, timestamps: true })

const ProductSpecSchema = new mongoose.Schema({
	specification: {
		specName: { type: String }
	},
	specValue: { type: String }
}, { _id: true })

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	thumbUrl: { type: String },
	discountPercentage: { type: Number, default: 0 },
	slug: { type: String, required: true, unique: true },
	basePrice: { type: Number, required: true },
	brandName: { type: String, index: true },
	categoryName: { type: String, index: true },
	images: { type: [ProductImageSchema], default: [] },
	productSpecs: { type: [ProductSpecSchema], default: [] },
	productVariants: { type: [ProductVariantSchema], default: [] }
}, { timestamps: true })

ProductSchema.pre('validate', function (next) {
	if (this.name) {
		this.slug = slugify(this.name, { lower: true })
	}
	next()
})

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema)

