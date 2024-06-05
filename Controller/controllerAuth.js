const authModel = require('../Model/model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const jwtKey = 'MY_JWT_KEY_ISMAIL';


const signUp = async (req, res) => {
    try {
        // console.log(req.body);
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        // console.log('Salt=>', salt);

        const hashPassword = bcrypt.hashSync(password, salt)
        // console.log('Hash=>', hashPassword);

        const userDetails = new authModel({
            ...req.body,
            password: hashPassword,
        })
        const insertedInfo = await userDetails.save()

        res.json({
            sucess: true,
            message: 'user register successfully',
            id: insertedInfo._id
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error, user not registered'
        })
    }
}

const signIn = async (req, res) => {
    try {
        const user = await authModel.findOne({ email: req.body.email })

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'user not found, please signUp first'
            })
        }

        const isValidUser = bcrypt.compareSync(req.body.password, user.password);

        if (!isValidUser) {
            return res.status(401).json({
                success: false,
                message: 'user and password incorrect'
            })
        }

        const expTime = Math.ceil(new Date().getTime() / 1000) + 3600;
        const payload = {
            userId: user._id,
            name: user.userName,
            exp: expTime
        }

        const token = jwt.sign(payload, jwtKey);

        res.json({
            sucess: true,
            token: token
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error while login', err
        })
    }

};


const authController = {
    signUp,
    signIn
}

module.exports = authController;