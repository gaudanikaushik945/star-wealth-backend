const Blog = require('../model/blog.model');
const Category = require('../model/category.model');
const path = require("path")
const fs = require("fs");
exports.createBlog = async (req, res) => {
  try {
    console.log("Creating blog with data:", req.body);
    let { title, content, authName, category, shortDescription, slug } = req.body;

    // Check for duplicate slug
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ success: false, message: "Blog with this slug already exists" });
    }

    // Check if category exists
    const findCategory = await Category.findById(category);
    if (!findCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Handle blog image
    // let image = null;
    // if (req.file) {
    //   image = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    //   console.log("Blog image uploaded: -----------------------------", image);
    // }

      if (req.file) {
      // Convert to full URL
      image = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;
      console.log("Blog image uploaded:", image);
    } else {
      console.log("No blog image uploaded");
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      authName,
      category: findCategory._id,
      shortDescription,
      BlogImage: image,
      slug,
    });

    await newBlog.save();
    await newBlog.populate("category", "name");

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};



// exports.getAllBlogs = async (req, res) => {
//     try {
//         const { title, categoryId, slug, blogId } = req.query;
//         console.log("Fetching blogs with query:", req.query);

//         let filter = {};
//         if (title) {
//             filter.title = new RegExp(title, 'i'); // case-insensitive search
//         }
//         if (categoryId) {
//             filter.category = categoryId;
//         }
//         if (slug) {
//             filter.slug = slug;
//         }
//         if (blogId) {
//             filter._id = blogId;
//         }

//         if (Object.keys(filter).length === 0) {
//             // If no filters are provided, return all blogs
//             const blogs = await Blog.find({ isDeleted: false });
//             console.log("Fetched all blogs:", blogs);
//             return res.status(200).json({ message: 'Blogs fetched successfully', data: blogs });
//         }
//         const findBlogs = await Blog.findOne({ ...filter, isDeleted: false });
//         console.log("Blogs found with filter:", findBlogs);

//         if (!findBlogs) {
//             return res.status(404).json({ message: 'No blogs found' });
//         }
//         return res.status(200).json({ message: 'Blogs fetched successfully', data: findBlogs });

//     } catch (error) {
//         console.error('Error fetching blogs:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// }

exports.getAllBlogs = async (req, res) => {
  try {
    
    const { title, categoryId, slug, blogId, categorySlug, page = 1, limit = 10 } = req.query;

    let filter = { isDeleted: false };

    if (title) {
      filter.title = new RegExp(title, "i");
    }
    if (categoryId) {
      filter.category = categoryId;
    }
    if (slug) {
      filter.slug = slug;
    }
    if (blogId) {
      try {
        filter._id = new mongoose.Types.ObjectId(blogId);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid blogId format" });
      }
    }

    if (categorySlug && !categoryId) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      filter.category = category._id;
    }

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    
    const blogs = await Blog.find(filter)
      .populate("category", "categoryName")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
      

    const totalBlogs = await Blog.countDocuments(filter);

    if (!blogs.length) {
      return res.status(404).json({ success: false, message: "No blogs found" });
    }

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: {
        data: blogs,
        pagination: {
          total: totalBlogs,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(totalBlogs / pageSize),
        }
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};




exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    console.log("Updating blog with ID:", blogId);

    const { title, content, authName, category, shortDescription, slug } = req.body;

    const findBlog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!findBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // 🔹 Handle new image upload
    if (req.file) {
      try {
        // Delete old image if exists
        if (findBlog.BlogImage) {
          const oldFileName = findBlog.BlogImage.replace(`${process.env.BASE_URL}`, "");
          console.log("++++++ oldFileName ==============", oldFileName);
          
          const oldImagePath = path.join(__dirname, "..", "uploads", oldFileName);
          console.log("======== oldImagePath ========", oldImagePath);
          

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old blog image deleted:", oldImagePath);
          }
        }

        // Save new image URL
        findBlog.BlogImage = `${process.env.BASE_URL}/uploads/${req.file.filename}`
        console.log("Blog image updated:", findBlog.BlogImage);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    // 🔹 Update other fields
    if (title) findBlog.title = title;
    if (content) findBlog.content = content;
    if (authName) findBlog.authName = authName;
    if (category) {
      const checkCategory = await Category.findById(category);
      if (!checkCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      findBlog.category = category;
    }
    if (shortDescription) findBlog.shortDescription = shortDescription;
    if (slug) {
      const existingSlug = await Blog.findOne({ slug, _id: { $ne: blogId } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: "Slug already exists" });
      }
      findBlog.slug = slug.toLowerCase().trim().replace(/\s+/g, "-");
    }

    const updatedBlog = await findBlog.save();
    console.log("Updated blog:", updatedBlog);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.query;

    const deletedBlog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    deletedBlog.isDeleted = true; // Soft delete
    await deletedBlog.save();


    return res.status(200).json({ success: true,message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ success: false,message: 'Internal server error' });
  }
}   