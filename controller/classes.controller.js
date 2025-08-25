const Classes = require("../model/classes.model");

// ➤ Create new class
exports.createClasses = async (req, res) => {
    try {

        const { trainer, date, timestamps, status, registerLink } = req.body;

        const newClass = new Classes({
            trainer,
            date,
            timestamps,
            status,
            registerLink,
        });

        await newClass.save();
        res.status(201).json({ success: true, data: newClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ➤ Get classes with optional filters
// exports.getClasses = async (req, res) => {

//     try {
//         console.log("----------  req.query; -------------", req.query);
        
//         const { trainer, status, fromDate, toDate, page = 1, limit = 10 } = req.query;

//         // Build dynamic filter
//         let filter = { isDeleted: false};

//         if (trainer) {
//             filter.trainer = { $regex: trainer, $options: "i" }; // case-insensitive search
//         }

//         if (status) {
//             filter.status = status;
//         }

//         if (fromDate && toDate) {
//             filter.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
//         } else if (fromDate) {
//             filter.date = { $gte: new Date(fromDate) };
//         } else if (toDate) {
//             filter.date = { $lte: new Date(toDate) };
//         }

//         // Convert page & limit to number
//         const pageNum = parseInt(page, 10) || 1;
//         const limitNum = parseInt(limit, 10) || 10;
//         const skip = (pageNum - 1) * limitNum;

//         // Count total documents for pagination
//         const total = await Classes.countDocuments(filter);

//         // Fetch paginated data
//         const classes = await Classes.find(filter)
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(3);
//             console.log("======== classes ==========", classes);
            

//         return res.status(200).json({
//             success: true,
//             data: {
//                 data: classes,
//                 paginaton: {
//                     total,
//                     page: pageNum,
//                     limit: limitNum,
//                     totalPages: Math.ceil(total / limitNum),
//                 }
//             },
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };






exports.getClasses = async (req, res) => {
  try {
    console.log("---------- req.query -------------", req.query);

    const { trainer, status, fromDate, toDate, page = 1, limit = 10 } = req.query;

    // Build dynamic filter
    let filter = { isDeleted: false };

    if (trainer) {
      filter.trainer = { $regex: trainer, $options: "i" }; // case-insensitive
    }

    if (status) {
      filter.status = status;
    }

    if (fromDate && toDate) {
      filter.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      filter.date = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.date = { $lte: new Date(toDate) };
    }

    // Convert pagination params
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Count total
    const total = await Classes.countDocuments(filter);

    // Fetch data
    const classes = await Classes.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(3);

    console.log("======== classes ==========", classes);

    return res.status(200).json({
      success: true,
      data: {
      data: classes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




exports.updateClasses = async (req, res) => {
  try {
    console.log("=-=-===== query -------", req.query);
        console.log("=-=-===== req.body -------", req.body);

    const { id } = req.query; // class ID from URL
    const { trainer, date, timestamps, status, registerLink } = req.body;

    // check if class exists
    const existingClass = await Classes.findById(id);
    console.log("========= ");
    
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // update fields
    existingClass.trainer = trainer || existingClass.trainer;
    existingClass.date = date || existingClass.date;
    existingClass.timestamps = timestamps || existingClass.timestamps;
    existingClass.status = status || existingClass.status;
    existingClass.registerLink = registerLink || existingClass.registerLink;

    const updatedClass = await existingClass.save();
    console.log("************** updatedClass ****************", updatedClass);
    

    return res.status(200).json({
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({
      message: "Server error while updating class",
      error: error.message,
    });
  }
};



exports.deleteClasses = async (req, res) => {
  try {
    console.log("-=======  req.query ==========", req.query);
    
    const { id } = req.query; // class ID from URL

    // check if class exists
    const existingClass = await Classes.findById(id);
        console.log("========= existingClass ======", existingClass);

    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    existingClass.isDeleted = true
   await existingClass.save()


    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({
      message: "Server error while deleting class",
      error: error.message,
    });
  }
};