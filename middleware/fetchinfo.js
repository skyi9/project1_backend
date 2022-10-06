const jwt = require('jsonwebtoken');
require('dotenv').config()

const fetchinfo = (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        res.status(500).send({ error: "authenticate using valid token" })
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        console.log(data);
        req.myuser = data.mynewuser;
        console.log(req.myuser);
        console.log(data.mynewuser);
        next();

    } catch (error) {
        res.status(500).send({ error: "authenticate using valid token" })
    }
}

module.exports = fetchinfo