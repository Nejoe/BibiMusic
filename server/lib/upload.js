const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        switch (file.fieldname) {
            case 'image':
                cb(null, './public/upload/images');
                break;
            case 'music':
                cb(null, './public/upload/music');
                break;
            case 'music_cover':
                cb(null, './public/upload/images/music_cover');
                break;
            case 'playlist_cover':
                cb(null, './public/upload/images/playlist_cover');
                break;
            case 'user_avatar':
                cb(null, './public/upload/images/user_avatar');
                break;
            case 'artist_avatar':
                cb(null, './public/upload/images/artist_avatar');
                break;
            case 'artist_photo':
                cb(null, './public/upload/images/artist_photo');

        }
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // 将文件名设置为 原始文件名 + 唯一的后缀 + 后缀名
        // 后缀名是原始文件的后缀名
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
});
const upload = multer({ storage });
module.exports = upload;