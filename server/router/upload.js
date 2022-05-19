const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');
const upload = require('../lib/upload');

router.post('/uploadImage', upload.single('image'), (req, res) => {
    console.log('req.file', req.file);
    res.json({
        code: 200,
        msg: '图片上传成功',
        obj: req.file
    })
})
router.post('/uploadArtistAvatar', upload.single('artist_avatar'), (req, res) => {
    res.json({
        code: 200,
        msg: '歌手头像上传成功',
        obj: req.file
    })
})
router.post('/uploadArtistPhoto', upload.single('artist_photo'), (req, res) => {
    res.json({
        code: 200,
        msg: '歌手大图上传成功',
        obj: req.file
    })
})
router.post('/uploadUserAvatar', upload.single('user_avatar'), (req, res) => {
    res.json({
        code: 200,
        msg: '用户头像上传成功',
        obj: req.file
    })
})
router.post('/uploadMusicCover', upload.single('music_cover'), (req, res) => {
    res.json({
        code: 200,
        msg: '音乐封面上传成功',
        obj: req.file
    })
})
router.post('/uploadPlaylistCover', upload.single('playlist_cover'), (req, res) => {
    res.json({
        code: 200,
        msg: '歌单封面上传成功',
        obj: req.file
    })
})
router.post('/uploadMusic', upload.single('music'), (req, res) => {
    console.log('req.file', req.file);
    console.log('req.body', req.body);
    res.json({
        code: 200,
        msg: '歌曲上传成功',
        obj: req.file
    })
})
module.exports = router;