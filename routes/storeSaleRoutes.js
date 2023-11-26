const express = require('express');
const router = express.Router();
const StoreSale = require('../models/storeSale');
const mongoose = require('mongoose');

// Show all invoices
router.get('/store-sales', async (req, res) => {
    try {
        const storeSales = await StoreSale.find();
        res.render('allinvoices', { storeSales }); // Render 'allinvoice' Handlebars view
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Filter invoices by sales range

router.get('/store-sales/sales-range', async (req, res) => {
    try {
        const { minSales, maxSales } = req.query;

        const query = {};

        // Construct the query dynamically based on the provided sales range
        if (minSales && maxSales) {
            query['Sales_in_thousands'] = { $gte: parseFloat(minSales), $lte: parseFloat(maxSales) };
        } else if (minSales) {
            query['Sales_in_thousands'] = { $gte: parseFloat(minSales) };
        } else if (maxSales) {
            query['Sales_in_thousands'] = { $lte: parseFloat(maxSales) };
        }

        const invoices = await StoreSale.find(query);

        if (invoices.length > 0) {
            // Generate HTML table with all details
            let table = '<table border="1"><tr>';
            
            // Adding table headers dynamically
            for (const key in invoices[0]._doc) {
                table += `<th>${key}</th>`;
            }
            table += '</tr>';

            invoices.forEach((invoice) => {
                table += '<tr>';
                for (const key in invoice._doc) {
                    table += `<td>${invoice[key]}</td>`;
                }
                table += '</tr>';
            });

            table += '</table>';
            
            res.send(table); // Send the HTML table as the response
        } else {
            res.status(404).json({ message: 'No matching invoices found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Show a specific invoice by ID
router.get('/store-sales/:InvoiceNo', async (req, res) => {
    try {
        const { InvoiceNo } = req.params;
        const storeSale = await StoreSale.findOne({ InvoiceNo: InvoiceNo }); // Query by InvoiceNo field
        if (storeSale) {
            res.json(storeSale);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Insert a new invoice - Render the form
router.get('/store-sales/:new', (req, res) => {
    res.render('insertInvoice'); // Renders the 'insertInvoice' Handlebars template for adding a new invoice
});


// Insert a new invoice - Handle form submission
router.post('/store-sales', async (req, res) => {
    const newSale = new StoreSale(req.body);
    try {
        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete an existing invoice by ID
router.delete('/store-sales/:InvoiceNo', async (req, res) => {
    try {
        const { InvoiceNo } = req.params;
        const deletedSale = await StoreSale.findOneAndDelete({ InvoiceNo });

        if (deletedSale) {
            return res.json({ message: 'Invoice deleted' });
        } else {
            return res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



// Update "Manufacturer" & “Price_in_thousands” of an existing invoice by ID
router.put('/store-sales/:InvoiceNo', async (req, res) => {
    try {
        const { InvoiceNo } = req.params;
        const updatedSale = await StoreSale.findOneAndUpdate(
            { InvoiceNo },
            req.body,
            { new: true }
        );
        
        if (updatedSale) {
            return res.json(updatedSale);
        } else {
            return res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


module.exports = router;
