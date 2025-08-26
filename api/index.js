const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('../Db/mongoose');

// Import routes
const categoryRoutes = require('../routes/category.routes');
const blogRoutes = require('../routes/blog.routes');
const seoRoutes = require('../routes/seo.routes');
const coursesRoutes = require('../routes/course.route');
const adminRoutes = require('../routes/admin.route');
const contactUsRoutes = require('../routes/contactus.route');
const classesRoutes = require("../routes/classes.route");

const cors = require('cors');
const path = require('path');

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies (no need for body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Serve static files (uploads)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// API routes
app.use('/api', categoryRoutes);
app.use('/api', blogRoutes);
app.use('/api', seoRoutes);
app.use('/api', coursesRoutes);
app.use('/api', adminRoutes);
app.use('/api', contactUsRoutes);
app.use("/api", classesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Server listen
const PORT = process.env.PORT_NUMBER ;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});


 module.exports = app