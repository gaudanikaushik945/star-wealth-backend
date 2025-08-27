const { default: mongoose } = require('mongoose');
const Course = require('../model/course.model');
require("dotenv").config()
const path = require("path")
const fs = require("fs")

exports.createCourse = async (req, res) => {
  try {
    console.log("====== req.body =====", req.body);
    console.log("=========== req.file =======", req.file);


    const { courseName, courseDescription, coursePrice, courseFeatured, paymnetLink, type, slug } = req.body;

    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }
    // const courseFeatured = JSON.parse(req.body.courseFeatured);


    let image = null;
    console.log("+++++++++++++ process.env.BASE_URL +++++++++++++++", process.env.BASE_URL);

    if (req.file) {
      // Convert to full URL
      image = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;
      console.log("Blog image uploaded:", image);
    } else {
      console.log("No blog image uploaded");
    }


    const newCourse = new Course({
      courseName,
      courseDescription,
      coursePrice,
      courseFeatured,
      courseImage: image,
      paymnetLink,
      type,
      slug,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({data:savedCourse, success: true, message: "Course created successfully" });
  } catch (error) {
    res.status(500).json({ success: false,message: error.message });
  }
}

// exports.getAllCourses = async (req, res) => {
//   try {
//     const { courseName, courseId, coursePrice, type, page = 1, limit = 10, slug } = req.query;
//     console.log("Fetching courses with query:", req.query);

//     let filter = { isDeleted: false };

//     if (courseName) {
//       filter.courseName = new RegExp(courseName, "i"); // case-insensitive search
//     }
//     if (courseId) {
//       filter._id = courseId;
//     }
//     if (coursePrice) {
//       filter.coursePrice = coursePrice;
//     }
//     if (type) {
//       filter.type = type;
//     }
//     if (slug) {
//       filter.slug = slug;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Get total count for pagination
//     const totalCourses = await Course.countDocuments(filter);
//     console.log("====== totalCourses ========", totalCourses)


//     // Fetch with pagination
//     const courses = await Course.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit));


//     console.log("Fetched courses:", courses.length);

//     return res.status(200).json({
//       success: true,
//       message: "Courses fetched successfully",
//       data: courses,
//       params: {
//         total: totalCourses,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(totalCourses / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


exports.getAllCourses = async (req, res) => {
  try {
    const { courseName, courseId, coursePrice, type, page = 1, limit = 10, slug } = req.query;
    console.log("Fetching courses with query:", req.query);

    let filter = { isDeleted: false };

    if (courseName) {
      filter.courseName = new RegExp(courseName, "i");
    }
    if (courseId) {
      filter._id = courseId;
    }
    if (coursePrice) {
      filter.coursePrice = Number(coursePrice); // ensure numeric
    }
    if (type) {
      filter.type = type;
    }
    if (slug) {
      filter.slug = slug;
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCourses = await Course.countDocuments({isDeleted: false});
    console.log("--------- totalCourses ---------", totalCourses);
    

    // Fetch with pagination
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

      console.log("========== courses.length =========", courses.length);
      
    return res.status(200).json({
      
      
      success: true,
      message: "Courses fetched successfully",
      data: {
        data: courses,
        pagination: {
          total: totalCourses,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalCourses / limitNumber),
        },
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// exports.updateCourse = async (req, res) => {
//   try {
//     const { courseId } = req.query;
//     console.log("Updating course with ID:", courseId);
//     console.log(
//       "========= req.body ======", req.body
//     );

//     const { courseName, courseDescription, coursePrice, courseFeatured, paymnetLink } = req.body;


//     const findCourse = await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId), isDeleted: false });
//     if (!findCourse) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     if (courseName) findCourse.courseName = courseName;
//     if (courseDescription) findCourse.courseDescription = courseDescription;
//     if (coursePrice) findCourse.coursePrice = coursePrice;
//     if (courseFeatured) findCourse.courseFeatured = courseFeatured;
//     if (paymnetLink) findCourse.paymnetLink = paymnetLink;
//     if (req.file) {
//       image = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;

//       findCourse.courseImage = image; // Assuming you are using multer for file uploads
//       console.log("Course image updated:", req.file.path);
//     } else {
//       console.log("No course image updated");
//     }

//     await findCourse.save();
//     return res.status(200).json({ success: true,message: 'Course updated successfully', course: findCourse });
//   } catch (error) {
//     console.error('Error updating course:', error);
//     return res.status(500).json({ success: false,message: 'Internal server error' });
//   }
// }



exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log("Updating course with ID:", courseId);
    console.log("========= req.body ======", req.body);

    const { courseName, courseDescription, coursePrice, courseFeatured, paymnetLink } = req.body;

    const findCourse = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      isDeleted: false,
    });
    if (!findCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (courseName) findCourse.courseName = courseName;
    if (courseDescription) findCourse.courseDescription = courseDescription;
    if (coursePrice) findCourse.coursePrice = coursePrice;
    if (courseFeatured) findCourse.courseFeatured = courseFeatured;
    if (paymnetLink) findCourse.paymnetLink = paymnetLink;

    if (req.file) {
    
      if (findCourse.courseImage) {
        try {
          const oldImagePath = path.join(
            __dirname,
            "..", 
            findCourse.courseImage.replace(`${process.env.BASE_URL}/`, "")
          );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old course image deleted:", oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      // 2. Navi image set karvi
      const image = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;
      findCourse.courseImage = image;
      console.log("Course image updated:", req.file.path);
    } else {
      console.log("No course image updated");
    }

    await findCourse.save();
    return res
      .status(200)
      .json({ success: true, message: "Course updated successfully", course: findCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log("========= courseId ======", courseId);


    const deletedCourse = await Course.findOne({ _id: courseId });
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    deletedCourse.isDeleted = true; // Soft delete
    await deletedCourse.save();
    console.log("========= deletedCourse =======", deletedCourse);
    

    return res.status(200).json({ success: true,message: 'Course deleted successfully', data: deletedCourse });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ success: false,message: 'Internal server error' });
  }
}