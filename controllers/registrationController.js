import userModel from "../models/UserModel.js";

export const UserRegistration = async (req, res) => {
    try {
        const user = req.user; // Get the logged-in user from the JWT (middleware)
        const { firstName, lastName, age, gender, interestedIn,userProfile } = req.body;

        // Check if user is already registered
        if (user.isRegistrationCompleted) {
            return res.status(200).send({ message: "You have already registered.",  data: updatedUser.isRegistrationCompleted });
        }

        // Update the user with registration data
        const updatedUser = await userModel.findByIdAndUpdate(user._id, {
            firstName,
            lastName,
            userProfile,
            age,
            gender,
            interestedIn,
            isRegistrationCompleted: true, // Mark the registration as completed
        }, { new: true }); // { new: true } will return the updated document

        // Send success response
        return res.status(200).send({ message: "Successfully registered.", data: updatedUser.isRegistrationCompleted });
    } catch (error) {
        return res.status(400).send({ message: "Error in registration", error: error.message });
    }
};
