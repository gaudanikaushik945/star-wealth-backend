const jwt = require('jsonwebtoken');
const Admin = require('../model/admin.model');

exports.authenticateAdmin = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id);
        if (!req.admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
}