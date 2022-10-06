const express = require('express');
const router = express.Router();
const newUser = require('../schemas/User');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

var fetchinfo = require('../middleware/fetchinfo')

router.post('/signup', body('email').isEmail(), body('password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let success = false
        try {
            let newuser = await newUser.findOne({ email: req.body.email })
            if (newuser) {
                return res.status(400).send({ error: 'a user with this email already exists' })
            }

            const salt = await bcrypt.genSalt(10)
            const securePassword = await bcrypt.hash(req.body.password, salt)

            newuser = await newUser.create({
                username: req.body.username,
                email: req.body.email,
                password: securePassword
            })
            const data = {
                mynewuser: {
                    mynewuserid: newuser.id,
                }
            }
            success = true
            console.log(data);
            const authtoken = jwt.sign(data, process.env.JWT_SECRET)
            res.json({ success, authtoken })

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'internal error occured' })
        }
    })

router.post('/login', body('email', 'please enter valid email').isEmail(),
    body('password', 'please enter valid password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        let success = false
        try {
            const { email, password } = req.body
            let myuser = await newUser.findOne({ email })
            if (!myuser) {
                return res.status(400).json({ error: 'enter correct credentials' })
            }
            let myuserpass = await bcrypt.compare(password, myuser.password)
            if (!myuserpass) {
                return res.status(400).json({ error: 'enter correct credentials' })
            }
            const data = {
                mynewuser: {
                    mynewuserid: myuser.id,
                }
            }
            success = true
            console.log(data);
            const authtoken = jwt.sign(data, process.env.JWT_SECRET)
            res.json({ success, authtoken })

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'internal error occured' })
        }

    })

router.get('/getuserdata', fetchinfo, async (req, res) => {
    let success = false
    try {
        const userid = req.myuser.mynewuserid
        console.log(req.user);
        const user = await newUser.findById(userid).select("-password")
        res.json({ user })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'internal error occured' })
    }
})

module.exports = router;
