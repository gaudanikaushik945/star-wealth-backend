const Admin = require('../model/admin.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });


        const savedAdmin = await newAdmin.save();
        console.log("========= savedAdmin ========", savedAdmin);

        return res.status(201).json({ message: 'Admin created successfully', admin: savedAdmin });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.loginAdmin = async (req, res) => {
  try {
    console.log("========= req.body ==========", req.body);

    const { email, password } = req.body;

    // findOne is better than find
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("========== token ===========", token);

   return res.status(200).json({
  success: true,
  data: {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  },
  message: "Login successful",
});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;

        await admin.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}