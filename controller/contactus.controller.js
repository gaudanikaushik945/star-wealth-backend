const  ContactUs = require('../model/contact.us.model');

exports.createContactUs = async (req, res) => {
    console.log("Creating contact request with data:", req.body);
    
    const { name, email, phoneNumber, message } = req.body;

    try {
        // Check if the contact already exists
        const existingContact = await ContactUs.findOne({  
            email 
        });
        console.log("Existing contact check:", existingContact);

        if (existingContact) {
            return res.status(400).json({ message: 'Contact request already exists' });
        }
        const newContact = new ContactUs({
            name,
            email,
            phoneNumber,
            message
        });
        console.log("New contact request data:", newContact);
        

        await newContact.save();
       return res.status(201).json({ message: 'Contact request created successfully', contact: newContact });
    } catch (error) {
       return res.status(500).json({ message: 'Error creating contact request', error: error.message });
    }
}

exports.getAllContacts = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.query;

    let filter = { isDeleted: false };

    if (name) {
      filter.name = new RegExp(name, "i"); // case-insensitive
    }
    if (email) {
      filter.email = email;
    }
    if (phoneNumber) {
      filter.phoneNumber = phoneNumber;
    }
    if (message) {
      filter.message = new RegExp(message, "i");
    }

    // Fetch contacts with applied filter
    const contacts = await ContactUs.find(filter);

    if (contacts.length === 0) {
      return res.status(404).json({ success: false, message: "No contacts found" });
    }

    return res.status(200).json({
      success: true,
      data: contacts,
      message: "Contacts fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};
