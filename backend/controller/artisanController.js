import Artisan from "../models/Artisan.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { sendNotification } from "../utils/notification.js";



export const registerArtisan = async (req, res) => {
  const { fullName, email, password, skillCategory, location, phone, yearsOfExperience, description } = req.body;

  try {
    const existing = await Artisan.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePhoto = null;
    let verificationDocs = []; 

    try {
      profilePhoto = req.files?.profilePhoto?.[0]?.path || null;
      verificationDocs = req.files?.verificationDocs?.map(file => file.path) || [];
    } catch (fileErr) {
      return res.status(500).json({ msg: "File upload failed", error: fileErr.message });
    }

    const artisan = await Artisan.create({
      fullName,
      description,
      email,
      skillCategory,
      location,
      phone,
      yearsOfExperience,
      password: hashedPassword,
      profilePhoto,
      verificationDocs
    });

    try {
      await sendEmail(
        artisan.email,
        "Registration Received",
        `<p>Hello ${artisan.fullName},</p><p>Your account is under review.</p>`
      );
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
    }

    const token = await generateToken(artisan._id, "artisan");

    res.status(201).json({
      message: "Artisan registered successfully. Awaiting approval.",
      token,
      artisan
    });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
export const loginArtisan = async(req, res)=>{
     const { email, password } = req.body;
      try {
       const artisan = await Artisan.findOne({email})
         if(!artisan){
            return res.status(401).json({msg: 'Invalid Credentials'})
         }

      const isMatch = await bcrypt.compare(password, artisan.password)
         if(!isMatch){
            return res.status(401).json({msg: 'Invalid Password'})
          }

         if(artisan.status !== 'approved'){
            return res.status(403).json({ message: "Account not approved yet" });
         }

       const token = await generateToken(artisan._id, "artisan"); 
    res.status(200).json({
      message: "Login successful",
      token,
      artisan: {
      id: artisan._id,
      fullName: artisan.fullName,
      skillCategory: artisan.skillCategory,
      location: artisan.location,
      rating: artisan.rating,
      },
     });

    
      } catch (error) {
            res.status(500).json({msg: 'Server Error'})
      }       
}

export const updateArtisan = async (req, res) => {
  try {
    const { fullName, password, phone, skillCategory, location, description } = req.body;
    const updateData = { fullName, phone, skillCategory, location, description };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (req.files?.profilePhoto) {
      updateData.profilePhoto = req.files.profilePhoto[0].path;
    }
    if (req.files?.verificationDocs) {
      updateData.verificationDocs = req.files.verificationDocs.map(file => file.path);
    }

    const artisan = await Artisan.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    res.json({ message: "Artisan updated successfully", artisan });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};



// Get all approved artisans (for students)
export const getArtisans = async (req, res) => {
  try {
    const { category, name, location } = req.query;

    let filter = { status: "approved" }; 
    if (category) filter.skillCategory = category;
    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    const artisans = await Artisan.find(filter).sort({ rating: -1 });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};


// Approve Artisan (used by admin)
export const approveArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findByIdAndUpdate(
      artisanId,
      { status: "approved" },
      { new: true }
    );

    if (!artisan) return res.status(404).json({ message: "Artisan not found" });


    // send email + notification
    await sendEmail(
      artisan.email,
      "Account Approved",
      `<p>Congratulations ${artisan.fullName}, your account is now approved.</p>`
    );
    sendNotification(artisan._id.toString(), "Your artisan account has been approved!");

    res.json({ message: "Artisan approved successfully", artisan });
  } catch (error) {
    res.status(500).json({ msg: "Server error"});
  }
};


// Reject Artisan (used by admin)
export const rejectArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findByIdAndUpdate(
      artisanId,
      { status: "rejected" },
      { new: true }
    );

    if (!artisan) return res.status(404).json({ message: "Artisan not found" });

    await sendEmail(
      artisan.email,
      "Account Rejected",
      `<p>Sorry ${artisan.fullName}, your account was rejected. Contact support for details.</p>`
    );
    sendNotification(artisan._id.toString(), "Your artisan account was rejected.");

    res.json({ message: "Artisan rejected successfully", artisan });
  } catch (error) {
    res.status(500).json({ msg: "Server error"});
  }
};



// Get artisans (pending + approved) for admin
export const getArtisansForAdmin = async (req, res) => {
  try {
    const artisans = await Artisan.find({
      status: { $in: ["pending", "approved"] }
    }).sort({ createdAt: -1 });

    res.json(artisans);
  } catch (error) {
    console.error("❌ Error fetching artisans:", error);
    res.status(500).json({ msg: "Server error" });
  }
};



// Add Previous Work
export const addPreviousWork = async (req, res) => {
  try {
    const { title, description } = req.body;
    let image = req.file ? req.file.path : null;

    const artisan = await Artisan.findById(req.user.id);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    artisan.previousWorks.push({ title, description, image });
    await artisan.save();

    res.status(201).json({ message: "Previous work added successfully", previousWorks: artisan.previousWorks });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// Get a single approved artisan by ID (for students)
export const getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({
      _id: req.params.id,
      status: "approved" 
    }).select("-password");

    if (!artisan) {
      return res.status(404).json({ msg: "Artisan not found or not approved" });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all previous works of the logged-in artisan
export const getOwnPreviousWorks = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.user.id).select("previousWorks");
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    res.json(artisan.previousWorks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// Get a single previous work by ID for the logged-in artisan
export const getOwnPreviousWorkById = async (req, res) => {
  try {
    const { workId } = req.params;
    const artisan = await Artisan.findById(req.user.id).select("previousWorks");
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    const work = artisan.previousWorks.id(workId);
    if (!work) return res.status(404).json({ msg: "Previous work not found" });

    res.json(work);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
 


export const getPreviousWorksByArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({
      _id: req.params.id,
      status: "approved",
    }).select("previousWorks fullName skillCategory location");

    if (!artisan) return res.status(404).json({ msg: "Artisan not found or not approved" });

    res.json(artisan.previousWorks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get a single previous work by ID of an approved artisan
export const getPreviousWorkById = async (req, res) => {
  try {
    const { workId } = req.params;

    const artisan = await Artisan.findOne({
      "previousWorks._id": workId,
      status: "approved",
    }).select("previousWorks fullName skillCategory location");

    if (!artisan) return res.status(404).json({ msg: "Previous work not found" });

    const work = artisan.previousWorks.id(workId);

    res.json({
      ...work.toObject(),
      artisanId: artisan._id,
      fullName: artisan.fullName,
      skillCategory: artisan.skillCategory,
      location: artisan.location,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};  


// Update a previous work of the logged-in artisan
export const updatePreviousWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const artisan = await Artisan.findById(req.user.id);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    const work = artisan.previousWorks.id(workId);
    if (!work) return res.status(404).json({ msg: "Previous work not found" });

    // Update fields
    if (title) work.title = title;
    if (description) work.description = description;
    if (image) work.image = image;

    await artisan.save();

    res.json({ message: "Previous work updated successfully", work });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete a previous work of the logged-in artisan
export const deletePreviousWork = async (req, res) => {
  try {
    const { workId } = req.params;

    const artisan = await Artisan.findById(req.user.id);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    const work = artisan.previousWorks.id(workId);
    if (!work) return res.status(404).json({ msg: "Previous work not found" });

    // Remove the work
    work.remove();
    await artisan.save();

    res.json({ message: "Previous work deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
