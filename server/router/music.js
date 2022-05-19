const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

router.get('/getMusicById', (req, res) => {
    const sql = `SELECT * FROM music WHERE id=?`;
    const values = [req.query.id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询音乐错误'
            })
        } else {
            const sql2 = 'SELECT artist.`name`,artist.id FROM music INNER JOIN artist_music ON music.id = artist_music.music_id INNER JOIN artist ON artist_music.artist_id = artist.id WHERE music.id = ?';
            const values2 = [req.query.id];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询歌手错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '查询成功',
                        obj: {
                            music: data[0],
                            artist: data2
                        }
                    })
                }
            })
        }
    })
});
// 根据歌手id获得音乐
router.get('/getMusicByArtistId', (req, res) => {
    const sql = `
    SELECT
        music.id AS music_id, 
        music.\`name\` AS music_name, 
        music.url AS music_url, 
        music.cover AS music_cover, 
        music.lrc AS music_lrc
    FROM
        music
        INNER JOIN
        artist_music
        ON 
            music.id = artist_music.music_id
        INNER JOIN
        artist
        ON 
            artist_music.artist_id = artist.id
    WHERE
        artist.id = ?
    `;
    const values = [req.query.artist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌手音乐错误'
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
// 分页模糊查询音乐
router.get('/getMusicByName', (req, res) => {
    const sql = `SELECT COUNT(*) AS count FROM music WHERE name LIKE ?`;
    const values = [`%${req.query.name}%`];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器查询音乐数量错误'
            })
        } else {
            const sql2 = `
            SELECT
                music.id AS music_id, 
                music.\`name\`AS music_name, 
                artist.id AS artist_id, 
                artist.\`name\` AS artist_name
            FROM
                music
                INNER JOIN
                artist_music
                ON 
                    music.id = artist_music.music_id
                INNER JOIN
                artist
                ON 
                    artist_music.artist_id = artist.id
            WHERE
                music.\`name\` LIKE ?
            LIMIT ?, ?
            `;
            const values2 = [`%${req.query.name}%`, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器模糊查询音乐错误'
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
// 添加音乐
router.post('/addMusic', (req, res) => {
    const sql = `INSERT INTO music (name, cover, url, lrc) VALUES (?, ?, ?, ?)`;
    const values = [req.body.musicName, req.body.coverUrl, req.body.musicUrl, req.body.lrc];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加音乐错误'
            })
        } else {
            const sql2 = `INSERT INTO artist_music (artist_id, music_id) VALUES (?, ?)`;
            const values2 = [req.body.artistId, data.insertId];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器关联音乐和歌手错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '添加成功'
                    })
                }
            })
        }
    })
});
// 添加音乐到歌单
router.post('/addMusicPlaylist', (req, res) => {
    // 查询歌单中是否存在该音乐
    const sql = `SELECT * FROM playlist_music WHERE playlist_id=? AND music_id=?`;
    const values = [req.body.playlistId, parseInt(req.body.musicId)];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌单是否存在音乐错误'
            })
        } else {
            if (data.length > 0) {
                res.json({
                    code: 201,
                    msg: '该音乐已存在'
                })
            } else {
                const sql2 = `INSERT INTO playlist_music (playlist_id, music_id) VALUES (?, ?)`;
                const values2 = [req.body.playlistId, parseInt(req.body.musicId)];
                query(sql2, values2, (err, data2) => {
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '服务器添加音乐到歌单错误'
                        })
                    } else {
                        res.json({
                            code: 200,
                            msg: '添加音乐到歌单成功'
                        })
                    }
                })
            }
        }
    })
});
// 修改音乐
router.post('/updateMusic', (req, res) => {
    const sql = `UPDATE music SET name=?, cover=?, url=?, lrc=? WHERE id=?`;
    const values = [req.body.musicName, req.body.coverUrl, req.body.musicUrl, req.body.lrc, parseInt(req.body.musicId)];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器修改音乐错误'
            })
        } else {
            // 修改歌手关联
            const sql2 = `UPDATE artist_music SET artist_id=? WHERE music_id=?`;
            const values2 = [req.body.artistId, parseInt(req.body.musicId)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器修改歌手关联错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '修改成功'
                    })
                }
            })
        }
    })
})
module.exports = router;