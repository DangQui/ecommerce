const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    phoneNumber: String,
    streetAddres: String,
    paid: Boolean,
});

export const Order = models?.Order || model('Order', OrderSchema);