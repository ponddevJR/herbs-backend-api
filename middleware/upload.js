const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,`img-${Date.now()}-${file.originalname.split(" ").join('')}`);
    }
})

exports.upload = multer({storage});