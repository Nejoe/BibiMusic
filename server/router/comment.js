const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

// 分页查询某音乐的评论
router.get('/getMusicComment', (req, res) => {
    // 查询评论数量
    const sql = 'SELECT COUNT(*) AS count FROM comment WHERE music_id = ?';
    const values = [req.query.music_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询评论数量错误'
            })
        } else {
            const total = data[0].count;
            const sql2 = `
            SELECT
                \`comment\`.content, 
                \`comment\`.time AS createTime, 
                \`user\`.\`name\` AS nickname, 
                \`user\`.avatar AS avatarUrl,
                \`comment\`.user_id,
                \`comment\`.id
            FROM
                \`comment\`
                INNER JOIN
                \`user\`
                ON 
                    \`comment\`.user_id = \`user\`.id
            WHERE
                \`comment\`.music_id = ?
            ORDER BY
                \`comment\`.time DESC
            LIMIT ?, ?
            `;
            const values2 = [req.query.music_id, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询评论错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '查询成功',
                        obj: {
                            data: data2,
                            total
                        }
                    })
                }
            })
        }
    })
});
// 分页查询某歌单的评论
router.get('/getPlaylistComment', (req, res) => {
    // 查询评论数量
    const sql = 'SELECT COUNT(*) AS count FROM comment WHERE playlist_id = ?';
    const values = [req.query.playlist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询评论数量错误'
            })
        } else {
            const total = data[0].count;
            const sql2 = `
            SELECT
                \`comment\`.content, 
                \`comment\`.time AS createTime, 
                \`user\`.\`name\` AS nickname, 
                \`user\`.avatar AS avatarUrl,
                \`comment\`.user_id,
                \`comment\`.id
            FROM
                \`comment\`
                INNER JOIN
                \`user\`
                ON 
                    \`comment\`.user_id = \`user\`.id
            WHERE
                \`comment\`.playlist_id = ?
            ORDER BY
                \`comment\`.time DESC
            LIMIT ?, ?
            `;
            const values2 = [req.query.playlist_id, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询评论错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '查询成功',
                        obj: {
                            data: data2,
                            total
                        }
                    })
                }
            })
        }
    })
});
// 分页查询某歌手的评论
router.get('/getArtistComment', (req, res) => {
    // 查询评论数量
    const sql = 'SELECT COUNT(*) AS count FROM comment WHERE artist_id = ?';
    const values = [req.query.artist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询评论数量错误'
            })
        } else {
            const total = data[0].count;
            const sql2 = `
            SELECT
                \`comment\`.content, 
                \`comment\`.time AS createTime, 
                \`user\`.\`name\` AS nickname, 
                \`user\`.avatar AS avatarUrl,
                \`comment\`.user_id,
                \`comment\`.id
            FROM
                \`comment\`
                INNER JOIN
                \`user\`
                ON 
                    \`comment\`.user_id = \`user\`.id
            WHERE
                \`comment\`.artist_id = ?
            ORDER BY
                \`comment\`.time DESC
            LIMIT ?, ?
            `;
            const values2 = [req.query.artist_id, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询评论错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '查询成功',
                        obj: {
                            data: data2,
                            total
                        }
                    })
                }
            })
        }
    })
});
// 分页查询某用户主页的评论
router.get('/getUserComment', (req, res) => {
    // 查询评论数量
    const sql = 'SELECT COUNT(*) AS count FROM comment WHERE user_page_id = ?';
    const values = [req.query.user_page_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询评论数量错误'
            })
        } else {
            const total = data[0].count;
            const sql2 = `
            SELECT
                \`comment\`.content, 
                \`comment\`.time AS createTime, 
                \`user\`.\`name\` AS nickname, 
                \`user\`.avatar AS avatarUrl,
                \`comment\`.user_id,
                \`comment\`.id
            FROM
                \`comment\`
                INNER JOIN
                \`user\`
                ON 
                    \`comment\`.user_id = \`user\`.id
            WHERE
                \`comment\`.user_page_id = ?
            ORDER BY
                \`comment\`.time DESC
            LIMIT ?, ?
            `;
            const values2 = [req.query.user_page_id, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询评论错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '查询成功',
                        obj: {
                            data: data2,
                            total
                        }
                    })
                }
            })
        }
    })
});
// 添加音乐评论
router.post('/addMusicComment', (req, res) => {
    const sql = 'INSERT INTO comment (user_id, music_id, content, time) VALUES (?, ?, ?, ?)';
    // 获取时间,yyyy-mm-dd hh:mm:ss
    const time = new Date().toLocaleString('chinese', { hour12: false }).toString();
    const values = [req.body.user_id, req.body.music_id, req.body.content, time];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加评论错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
});
// 添加歌单评论
router.post('/addPlaylistComment', (req, res) => {
    const sql = 'INSERT INTO comment (user_id, playlist_id, content, time) VALUES (?, ?, ?, ?)';
    // 获取时间,yyyy-mm-dd hh:mm:ss
    const time = new Date().toLocaleString('chinese', { hour12: false }).toString();
    const values = [req.body.user_id, req.body.playlist_id, req.body.content, time];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加评论错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
});
// 添加歌手评论
router.post('/addArtistComment', (req, res) => {
    const sql = 'INSERT INTO comment (user_id, artist_id, content, time) VALUES (?, ?, ?, ?)';
    // 获取时间,yyyy-mm-dd hh:mm:ss
    const time = new Date().toLocaleString('chinese', { hour12: false }).toString();
    const values = [req.body.user_id, req.body.artist_id, req.body.content, time];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加评论错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
});
// 添加用户主页评论
router.post('/addUserComment', (req, res) => {
    const sql = 'INSERT INTO comment (user_id, user_page_id, content, time) VALUES (?, ?, ?, ?)';
    // 获取时间,yyyy-mm-dd hh:mm:ss
    const time = new Date().toLocaleString('chinese', { hour12: false }).toString();
    const values = [req.body.user_id, req.body.user_page_id, req.body.content, time];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器添加评论错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
});
// 删除评论
router.post('/deleteComment', (req, res) => {
    const sql = `DELETE FROM comment WHERE id=?`;
    const values = [req.body.comment_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器删除评论错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '删除成功'
            })
        }
    })
})

module.exports = router;