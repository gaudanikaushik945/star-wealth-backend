const SEO = require('../model/seo.model');
require("dotenv").config()

exports.createSEO = async (req, res) => {
  try {
    console.log("========= req.body ========", req.body);

    const { title, description, keywords, slug } = req.body;

    if (!title || !description || !slug) {
      return res.status(400).json({ message: 'Title, description, and slug are required' });
    }

    const existingSEO = await SEO.findOne({ slug });
    if (existingSEO) {
      return res.status(400).json({ message: 'SEO already exists' });
    }

    let image = null;
    if (req.file) {
      // Use filename instead of full path
      image = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
      console.log("Blog image uploaded:", image);
    } else {
      console.log("No blog image uploaded");
    }

    const newSEO = new SEO({
      title,
      description,
      keywords,
      slug,
      seoImage: image,
    });

    await newSEO.save();

    return res.status(201).json({
      success: true,
      message: 'SEO created successfully',
      data: newSEO,
    });

  } catch (error) {
    console.error('Error creating SEO:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllSEOs = async (req, res) => {
  try {
    const { slug, seoId, title, description, keywords, page = 1, limit = 10 } = req.query;
    console.log("Fetching SEOs with query:", req.query);

    let filter = { isDeleted: false };

    if (slug) {
      filter.slug = slug;
    }
    if (seoId) {
      filter._id = seoId;
    }
    if (title) {
      filter.title = new RegExp(title, "i");
    }
    if (description) {
      filter.description = new RegExp(description, "i");
    }
    if (keywords) {
      filter.keywords = { $in: keywords.split(",").map((k) => k.trim()) };
    }

    console.log("---- filter -----", filter);

    // pagination
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // total count
    const totalSEOs = await SEO.countDocuments(filter);

    // fetch paginated
    const seos = await SEO.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    if (!seos.length) {
      return res.status(404).json({ success: false, message: "No SEOs found" });
    }

    return res.status(200).json({
      success: true,
      message: "SEOs fetched successfully",
      //   data: seos,
      data: {
        data: seos,
        pagination: {
          total: totalSEOs,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(totalSEOs / pageSize),
        }
      },
    });
  } catch (error) {
    console.error("Error fetching SEOs:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};



exports.updateSEO = async (req, res) => {
  try {
    console.log("==== req.query =====", req.query);
    console.log("===== body ====", req.body);
    const { seoId } = req.query;
    const { title, description, keywords, slug } = req.body;



    const findSEO = await SEO.findOne({ _id: seoId, isDeleted: false });
    if (!findSEO) {
      return res.status(404).json({ message: 'SEO not found' });
    }

    if (title) findSEO.title = title;
    if (description) findSEO.description = description;
    if (keywords) findSEO.keywords = keywords;
    if (slug) findSEO.slug = slug;



    await findSEO.save();
    console.log("====== findSEO ======", findSEO);

    return res.status(200).json({ success: true,message: 'SEO updated successfully', seo: findSEO });
  } catch (error) {
    console.error('Error updating SEO:', error);
    return res.status(500).json({ success: false,message: 'Internal server error' });
  }
}

exports.deleteSEO = async (req, res) => {
  try {
    console.log("==== req.query deleteSEO =====", req.query);

    const { seoId } = req.query;

    const deletedSEO = await SEO.findOne(({ _id: seoId }));
    if (!deletedSEO) {
      return res.status(404).json({ message: 'SEO not found' });
    }

    deletedSEO.isDeleted = true; // Soft delete
    await deletedSEO.save();

    return res.status(200).json({ success: true,message: 'SEO deleted successfully', seo: deletedSEO });
  } catch (error) {
    console.error('Error deleting SEO:', error);
    return res.status(500).json({ success: false,message: 'Internal server error' });
  }
}