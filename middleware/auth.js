const jwt = require('jsonwebtoken');

exports.auth = async (req,res,next) => {
    try {
        const cookie = await req.cookies.token;
        if(!cookie)console.log('no token');
        const user = jwt.verify(cookie,process.env.JWT_SECRET);
        if(!user)res.status(401).json({err:"กรุณาเข้าสู่ระบบ"});

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.error(error);
    }
}

exports.authAdmin = async (req,res,next) => {
    try {
        const cookie = await req.cookies.token;
        if(!cookie)console.log('no token');
        const user = jwt.verify(cookie,process.env.JWT_SECRET);
        if(!user)res.status(401).json({err:"กรุณาเข้าสู่ระบบ"});
        if(user.role !== 'admin')
            return res.status(401).json({err:"wrong token!"});
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.error(error);
    }
}