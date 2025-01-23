// const mongoose = require('mongoose');
// const validator = require('validator');
import mongoose from 'mongoose';
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple `null` values and enforce uniqueness for non-null values
    },
    emailId: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: validator.isEmail, // Use validator.js for email validation
        message: 'Please provide a valid email address',
      },
    },
    userProfile: {
      type: String,
      default:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fprofile-user-icons-for-free-download--167407311142339747%2F&psig=AOvVaw1rS7sy8WAs7-drt6SnXwxm&ust=1736754848750000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIDzkZPa74oDFQAAAAAdAAAAABAJ',
    },
    phoneNumber: {
      type: String,
    //   required: [true, 'Phone number is required'],
      unique: true,
      sparse: true, // Allow multiple `null` values and enforce uniqueness for non-null values
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Validates a 10-digit phone number
        },
        message: 'Please provide a valid 10-digit phone number',
      },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple `null` values and enforce uniqueness for non-null values
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      validate: {
        validator: function (v) {
          return v.every(value => ['Male', 'Female', 'Other'].includes(value));
        },
        message: 'gender can only contain Male, Female, or Other',
      },
    },
    skills: {
      type: [String],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      // validate: {
      //   validator: function (v) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      //   },
      //   message:
      //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // },
      required: function() {
        // Only require password if there is no googleId
        return !this.googleId;
      },
    },
    interestedIn: {
      type: [String],
      enum: ['Male', 'Female', 'Other'],
      validate: {
        validator: function (v) {
          return v.every(value => ['Male', 'Female', 'Other'].includes(value));
        },
        message: 'InterestedIn can only contain Male, Female, or Other',
      },
    },
    showMyGender:{
      type: Boolean,
      default: false,
    },
    projects: [
        {
          title: {
            type: String,
            required: [true, 'Project title is required'],
          },
          description: {
            type: String,
            required: [true, 'Project description is required'],
          },
          url: {
            type: String,
            validate: {
              validator: function (v) {
                return validator.isURL(v); // Validate URL format
              },
              message: 'Please provide a valid URL for the project',
            },
          },
          githubLink: {
            type: String,
            validate: {
              validator: function (v) {
                return validator.isURL(v); // Validate URL format
              },
              message: 'Please provide a valid GitHub link',
            },
          },
        },
      ],
    experience: [
        {
            companyName:{
                type: String,
                require: [true, "company name is required"]
            },
            position:{
                type: String,
                require: [true, "position name is required"],
            },
            discription:{
                type: String,
            }

        },
        
    ],
    about: {
      type: String,
    },
    linkedinId: {
      type: String,
    },
    instagramId: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    isRegistrationCompleted : {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
// module.exports = userModel;
export default userModel;
