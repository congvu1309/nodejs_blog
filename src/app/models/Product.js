const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

const Product = new Schema(
    {
        product_name: { type: String, required: true },
        product_img: { type: String, required: true },
        category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_describe: { type: String, required: true },
        product_content: { type: String, required: true },
        product_status: { type: String, required: true },
        slug: { type: String, slug: 'product_name', unique: true}
    },
    {
        timestamps: true,
    }
);

//Add plugins
mongoose.plugin(slug);
Product.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Product', Product);


