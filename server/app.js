const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// 设置端口
const port = 3000;
// 引入路由
const userRoute = require('./router/user');
const artistRoute = require('./router/artist');
const musicRoute = require('./router/music');
const playlistRoute = require('./router/playlist');
const commentRoute = require('./router/comment');
const messageRoute = require('./router/message');
const uploadRoute = require('./router/upload');
const dormitoryRoute = require('./router/dormitory');
const studentRoute = require('./router/student');

// 设置日志
app.use(morgan('dev'));
app.use(express.static('public'));
// 设置favicon
app.use(favicon(__dirname + '/public/favicon.ico'));
// 设置body-parser,用于解析请求体
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 设置跨域访问
app.use(cors());
// app.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFelid,multipart/form-data');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Credentials', "true");
//     if (req.method.toLowerCase() === 'options') {
//         res.send(200); //让options尝试请求快速结束
//     } else {
//         next();
//     }
// });

// 设置路由
app.use('/user', userRoute);
app.use('/artist', artistRoute);
app.use('/music', musicRoute);
app.use('/playlist', playlistRoute);
app.use('/comment', commentRoute);
app.use('/message', messageRoute);
app.use('/upload', uploadRoute);
app.use('/dormitory', dormitoryRoute);
app.use('/student', studentRoute);
//监听端口
app.listen(port, () => {
    console.log(`服务器启动成功，端口号为${port}`);
});