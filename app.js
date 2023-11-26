const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars'); // Move this line up to initialize exphbs

const path = require('path');
const storeSaleRoutes = require('./routes/storeSaleRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shrey', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handlebars setup
const handlebars = exphbs.create({
    // Specify runtime options
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', storeSaleRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
