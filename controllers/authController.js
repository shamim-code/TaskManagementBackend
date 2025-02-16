const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// User Registration
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.scretKey, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate OTP
        const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
        const otp = generateOTP();

        // Update OTP and status
        user.otp = otp;
        user.otpStatus = "true";
        user.otpExpires = Date.now() + 2 * 60 * 1000; // Expires in 2 minutes
        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "myapp",
                pass: "mfzj utxg ncog hrpk",
            },
        });

        const mailOptions = {
            from: "bdcallingshamim@gmail.com",
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 2 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        //Automatically set otpStatus to "false" after 2 minutes
        setTimeout(async () => {
            await User.findByIdAndUpdate(user._id, { otpStatus: "false" });
            res.send("OTP expired, status updated");
        }, 2 * 60 * 1000);

        res.json({ message: "OTP sent to email", otp });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile retrieved successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
