import Booking from "../models/Booking.js";
import Artisan from "../models/Artisan.js";
import { sendEmail } from "../utils/email.js";
import { sendNotification } from "../utils/notification.js";

// Create a new booking (Student only)
export const createBooking = async (req, res) => {
  try {
    const { artisanId, jobDetails, scheduledDate } = req.body;
    const studentId = req.user.id;

    const artisan = await Artisan.findById(artisanId);
    if (!artisan || artisan.status !== "approved") {
      return res.status(404).json({ message: "Artisan not available" });
    }

    const booking = await Booking.create({
      student: studentId,
      artisan: artisanId,
      jobDetails,
      scheduledDate,
    });

    await sendEmail(
      artisan.email,
      "New Job Request",
      `<p>Hello ${artisan.fullName},</p>
       <p>You have a new booking request for: <b>${jobDetails}</b>.</p>`
    );
    sendNotification(artisan._id.toString(), "You have a new job request!");

    res.status(201).json({ msg: "Booking Created Successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error"});
  }
};

// Get all bookings for the logged-in student
export const getBookingByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const bookings = await Booking.find({ student: studentId })
      .populate("artisan", "fullName skillCategory location rating")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get all bookings for the logged-in artisan
export const getBookingByArtisan = async (req, res) => {
  try {
    const artisanId = req.user.id;
    const bookings = await Booking.find({ artisan: artisanId })
      .populate("student", "name email phone faculty department")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Update booking status (Artisan only)
// Update booking status (Artisan only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const artisanId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate("student artisan");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only artisan can change status
    if (booking.artisan._id.toString() !== artisanId) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    // Restrict allowed transitions
    if (booking.status === "pending" && !["accepted", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "You can only accept or cancel a pending booking" });
    }
    if (booking.status === "accepted" && status !== "completed") {
      return res.status(400).json({ message: "You can only complete an accepted booking" });
    }
    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking already closed" });
    }

    booking.status = status;
    await booking.save();

    // Notify student
    await sendEmail(
      booking.student.email,
      "Booking Update",
      `<p>Hello ${booking.student.name},</p>
       <p>Your booking for <b>${booking.jobDetails}</b> is now: <b>${status}</b>.</p>`
    );
    sendNotification(booking.student._id.toString(), `Your booking status changed to: ${status}`);

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

