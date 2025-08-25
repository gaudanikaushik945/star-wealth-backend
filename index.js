const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./Db/mongoose');
const categoryRoutes = require('./routes/category.routes');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blog.routes');
const seoRoutes = require('./routes/seo.routes');
const coursesRoutes = require('./routes/course.route');
const adminRoutes = require('./routes/admin.route');
const contactUsRoutes = require('./routes/contactus.route');
const classesRoutes = require("./routes/classes.route")
const cors = require('cors');
const path = require('path');

// Middleware to enable CORS
app.use(cors());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());



// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to handle routes
app.use('/api', categoryRoutes);
app.use('/api', blogRoutes);
app.use('/api', seoRoutes);
app.use('/api', coursesRoutes);
app.use('/api', adminRoutes);
app.use('/api', contactUsRoutes);
app.use("/api", classesRoutes)



app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.listen(process.env.PORT_NUMBER , () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});