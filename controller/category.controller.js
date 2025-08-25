const Category = require('../model/category.model');

exports.createCategory = async (req, res) => {
    try {
        console.log("Creating category with data:", req.body);

        const { categoryName, slug, } = req.body;

        const existingCategory = await Category.findOne({ categoryName, slug });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ categoryName, slug, });
        await newCategory.save();
        return res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const { categoryName, categoryId, slug, page = 1, limit = 10 } = req.query;
        console.log("Fetching categories with query:", req.query);

        let filter = { isDeleted: false };

        if (categoryName) {
            filter.categoryName = categoryName;
        }

        if (categoryId) {
            filter._id = categoryId;
        }

        if (slug) {
            filter.slug = slug;
        }

        // pagination
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        // count total
        const totalCategories = await Category.countDocuments(filter);

        // fetch data
        const categories = await Category.find(filter)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        if (!categories.length) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }


        return res.status(200).json({
            data: {
                data: categories,
                pagination: {
                    total: totalCategories,
                    page: pageNumber,
                    limit: pageSize,
                    totalPages: Math.ceil(totalCategories / pageSize),
                }

            },
            success: true,
            message: "Categories fetched successfully",
            // data: categories,

        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        console.log("===== req.query =====", req.query);
        console.log("======== req.body ========", req.body);


        const { categoryId } = req.query;
        const { categoryName, slug } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { categoryName, slug }, { new: true });
        console.log("======== updatedCategory =========", updatedCategory);

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ success: true, message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId, categoryName } = req.query;

        if (categoryName) {
            const deletedCategory = await Category.findOne({ categoryName });
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            deletedCategory.isDeleted = true; // Soft delete
            await deletedCategory.save();
            return res.status(200).json({ success: true, message: 'Category deleted successfully', category: deletedCategory });
        }

        if (categoryId) {
            const deletedCategory = await Category.findOne({ _id: categoryId });
            if (!deletedCategory) {
                return res.status(404).json({ success: true, message: 'Category not found' });
            }

            deletedCategory.isDeleted = true; // Soft delete
            await deletedCategory.save();
            return res.status(200).json({ success: true, message: 'Category deleted successfully', category: deletedCategory });
        }


    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


