const jwt = require('jsonwebtoken')

const User = require("../../models/user");
const { registerSchema, loginSchema } = require("../../validator/validator");

const { JWT_SECRET, JWT_EXPIRES } = process.env

const signToken = (id) => 
    jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    })
    

const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: "Missing requires name field" })
        }
        const { email } = value;
        const data = await User.exists({ email })
        if (data) {
            res.status(409).json({ message: "User with this email already exists..." })
        }
        const newUser = await User.create({
            ...req.body
        })
        newUser.password = undefined;

        const token = signToken(newUser.id);

        res.status(201).json({
            user: newUser,
            token,
        })
    }
    catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: "Missing requires name field" })
        }
        
        const { email, password } = req.body
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: "Not authorized..." });
        }
        const passwordIsValid = await user.checkPassword(password, user.password);
        if (!passwordIsValid) {
            res.status(401).json({ message: "Not authorized..." });
        }
        user.password = undefined;

        const token = signToken(user.id);
        await User.findByIdAndUpdate(user.id, { token })
        
        res.status(200).json({
            user,
            token,
        })
    }
    catch (error) {
        next(error)
    }
}

const logoutUser = async (req, res) => {
    const {id} = req.user
    await User.findByIdAndUpdate(id, {token: null})
    res.status(204).json({ message: "No Content" })
}

const currentUser = async (req, res) => {
    const { email, subscription } = req.user
    res.status(200).json({
        email,
        subscription,
    })
}

module.exports = { registerUser, loginUser, currentUser, logoutUser }

