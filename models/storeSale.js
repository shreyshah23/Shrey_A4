const mongoose = require('mongoose');

const storeSalesSchema = new mongoose.Schema({
    InvoiceNo: String,
    image: String,
    Manufacturer: String,
    class: String,
    Sales_in_thousands: Number,
    __year_resale_value: Number,
    Vehicle_type: String,
    Price_in_thousands: Number,
    Engine_size: Number,
    Horsepower: Number,
    Wheelbase: Number,
    Width: Number,
    Length: Number,
    Curb_weight: Number,
    Fuel_capacity: Number,
    Fuel_efficiency: Number,
    Latest_Launch: String,
    Power_perf_factor: Number,
    // ... other fields from your dataset
});

const StoreSale = mongoose.model('StoreSale', storeSalesSchema);

module.exports = StoreSale;
