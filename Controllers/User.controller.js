const createError = require("http-errors");
const { User } = require("../Models/User.model");
const { userValidate } = require("../helpers/validation");
const { signAccessToken, signRefreshToken } = require("../helpers/jwt_service");

module.exports = {
    // Register
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Validate data
            const { error } = userValidate(req.body);

            if (error) {
                throw createError.Unauthorized(error.details[0].message);
            }

            // Check user is exists
            const isExists = await User.findOne({
                username: email,
            });

            if (isExists) {
                throw createError.Conflict(`${email} is ready been registed!`);
            }

            // Create user model
            const user = new User({
                username: email,
                password,
            });

            // Save user in db
            const savedUser = await user.save();

            return res.json({
                status: 200,
                data: savedUser,
            });
        } catch (error) {
            next(error);
        }
    },
    // Refresh token
    refreshToken: async (req, res, next) => {
        try {
            const { userId } = req.payload;

            if (!userId) {
                throw createError.BadRequest();
            }

            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);

            return res.json({
                status: 200,
                accessToken,
                refreshToken: refToken,
            });
        } catch (error) {
            next(error);
        }
    },
    // Login
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Validate data
            const { error } = userValidate(req.body);

            if (error) {
                throw createError.Unauthorized(error.details[0].message);
            }

            // Find user follow email in DB
            const user = await User.findOne({ username: email });

            // Check user alrealy exists
            if (!user) {
                throw createError.Unauthorized("User not registed!");
            }

            // Check password is correct
            const isCorrectPassword = await user.isCorrectPassword(password);

            if (!isCorrectPassword) {
                throw createError.Unauthorized("Password is not correct");
            }

            // Create access token
            const accessToken = await signAccessToken(user._id);
            // Create refresh token
            const refreshToken = await signRefreshToken(user._id);

            return res.json({
                status: 200,
                accessToken,
                refreshToken,
            });
        } catch (error) {
            next(error);
        }
    },
    // Logout
    logout: (req, res, next) => {
        try {
            res.send("Logout success!");
        } catch (error) {
            next(error);
        }
    },
    // Get list
    getList: (req, res, next) => {
        console.log(req.headers);
        const users = [
            {
                _id: 1,
                username: "kiennt",
            },
            {
                _id: 1,
                username: "locsonhg",
            },
        ];

        return res.json({
            users,
        });
    },
};
