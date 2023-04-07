const jwt = require('jsonwebtoken')
const gravatar = require("gravatar");

const User = require("../../models/user");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
// const { nanoid } = require('nanoid');

const { v4: uuidv4 } = require('uuid');

const { registerSchema, loginSchema, verifySchemaEmail } = require("../../validator/validator");

const { JWT_SECRET, JWT_EXPIRES } = process.env

const {sendEmail}  = require("../../helpers/email");

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
        const avatarURL = gravatar.url(email, { d: 'monsterid' });
        // const avatarURL = gravatar.url(email);

        const verificationToken = uuidv4();

        const newUser = await User.create({
            ...req.body,
            avatarURL,
            verificationToken
        })
        newUser.password = undefined;

        const token = signToken(newUser.id);

        const mail = {
            to: email,
            subject: "Submit your email",
            html:`<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Submit your email</a>`
        }

        await sendEmail(mail)

        res.status(201).json({
            user: newUser,
            token,
            avatarURL,
            verificationToken
        })
    }
    catch (error) {
        next(error)
    }
}

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        res.status(404).json({ message: "Not Found'" })
    }
    await User.findByIdAndUpdate(user.id, { verify: true, verificationToken: "" });

    res.status(200).json({ message: "Verification successful" });
}

const verifyRepeatEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // const { verificationToken } = user;

    const { error } = verifySchemaEmail.validate(req.body)
    if (error) {
        return res.status(400).json({ message: "Missing required field email"});
    }
    if (user.verify) {
        return res.status(400).json({ message: "Verification has already been passed"});
    }
    const mail = {
        to: email,
        subject: "Email submission",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Submit email</a>`,
    };

    await sendEmail(mail);
    res.status(200).json({ message: "Verification email sent" });
};

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
        // if (!user.verify) {
        //     res.status(400).json({ message: "Email is wrong or not verify" });
        // }

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

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
const updateAvatar = async (req, res) => {
    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user
    
    try {
        const avatarName = `${_id}_${originalname}`
        
        const resultUpload = path.join(avatarsDir, avatarName)
        await fs.rename(tempUpload, resultUpload);

        await Jimp.read(resultUpload).then((avatar) => {
            return avatar.resize(250,250).write(resultUpload)
        })
        const avatarURL = path.join("public", "avatars", avatarName);
        await User.findByIdAndUpdate(_id, { avatarURL });
        res.json({ avatarURL });
    } catch (error) {
        await fs.unlink(tempUpload);
    }
}
module.exports = { registerUser, loginUser, currentUser, logoutUser, updateAvatar, verifyEmail, verifyRepeatEmail }

