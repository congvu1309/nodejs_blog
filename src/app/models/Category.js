const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Category = new Schema(
    {
        category_name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

//Add plugins
Category.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Category', Category);