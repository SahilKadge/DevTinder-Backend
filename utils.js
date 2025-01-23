export const safeData = (user) => {
    return {
        _id: user._id,
        emailId: user.emailId,
        interestedIn: user.interestedIn,
        showMyGender: user.showMyGender,
        projects: user.projects,
        experience: user.experience,
        firstName: user.firstName,
        gender: user.gender,
        lastName: user.lastName,
        userProfile: user.userProfile,
        age: user.age,
        isRegistrationCompleted: user.isRegistrationCompleted
    };
};

export const safeDataGeneral = " _id emailId interestedIn showMyGender projects experience firstName gender lastName userProfile age isRegistrationCompleted"