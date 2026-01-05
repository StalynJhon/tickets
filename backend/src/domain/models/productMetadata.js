const mongoose = require('mongoose');

const productMetadataSchema = new mongoose.Schema({
    imageUrl: String,
    gallery: [String],
    specifications: {
        weight: String,
        dimensions: String,
        materials: String,
        color: String
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    idProductSql: String
}, {
    timestamps: true,
    collection: 'productMetadata'
});

const ProductMetadata = mongoose.model('ProductMetadata', productMetadataSchema);
module.exports = ProductMetadata;