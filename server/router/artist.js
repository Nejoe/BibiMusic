const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

router.get('/getAllArtistName', (req, res) => {
    const sql = `
    SELECT
        artist.id, 
        artist.\`name\`, 
        artist.avatar
    FROM
        artist
    ORDER BY
        artist.\`name\` ASC
    `;
    query(sql, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌手错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '查询成功',
                obj: data
            })
        }
    })
});
// 根据歌手id获得歌手信息
router.get('/getArtistById', (req, res) => {
    const sql = `
    SELECT
        artist.id AS artist_id, 
        artist.\`name\` AS artist_name, 
        artist.description, 
        artist.avatar, 
        artist.photo
    FROM
        artist
    WHERE
        artist.id = ?
    `;
    const values = [req.query.artist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌手信息错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '查询成功',
                obj: data
            })
        }
    })
});
// 根据名字获得歌手
router.get('/getArtistByName', (req, res) => {
    const sql = `SELECT COUNT(*) AS count FROM artist WHERE name LIKE ?`;
    const values = [`%${req.query.name}%`];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器模糊查询歌手数量错误'
            })
        } else {
            const sql2 = `
            SELECT
                artist.id AS artist_id, 
                artist.\`name\` AS artist_name, 
                artist.description, 
                artist.avatar
            FROM
                artist
            WHERE
                artist.\`name\` LIKE ?
            LIMIT ?, ?
            `;
            const values2 = [`%${req.query.name}%`, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器模糊查询歌手错误'
                    })
                } else {
                    res.json({
                        msg: '查询成功',
                        code: 200,
                        obj: {
                            data: data2,
                            total: data[0].count
                        }
                    })
                }
            })
        }
    })
});
// 添加歌手
router.post('/addArtist', (req, res) => {
    const sql = 'INSERT INTO artist(name,description,avatar) VALUES(?,?,?)';
    const values = [req.body.artistName, req.body.description, req.body.avatarUrl];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加歌手错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
});
// 修改歌手信息
router.post('/updateArtist', (req, res) => {
    const sql = `
    UPDATE
        artist
    SET
        name = ?,
        description = ?,
        avatar = ?
    WHERE
        id = ?
    `;
    const values = [req.body.artistName, req.body.description, req.body.avatar, req.body.artistId];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器修改歌手信息错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '修改歌手信息成功'
            })
        }
    })
})

module.exports = router;