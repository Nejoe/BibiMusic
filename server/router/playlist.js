const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

// 分页查询discover页展示歌单
router.get('/getDiscoverPlaylist', (req, res) => {
    const sql = `
    SELECT
        playlist.id,playlist.\`name\` AS playlistTitle 
    FROM 
        playlist 
    WHERE 
        playlist.user_id = 1
        ORDER BY RAND()
    LIMIT ?, ?
    `;
    const values = [(req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌单错误'
            })
        } else {
            const sql2 = `
                SELECT
                    music.id, 
                    music.\`name\`, 
                    music.cover
                FROM
                    music
                    INNER JOIN
                    playlist_music
                    ON 
                        music.id = playlist_music.music_id
                    INNER JOIN
                    playlist
                    ON 
                        playlist_music.playlist_id = playlist.id
                WHERE
                    playlist_music.playlist_id = ?
                LIMIT ?
                `
            for (let i = 0; i < data.length; i++) {
                data[i].musicList = [];
                const values2 = [data[i].id, parseInt(req.query.songLimit)];
                query(sql2, values2, (err, data2) => {
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '服务器查询歌单歌曲错误'
                        })
                    } else {
                        data2.forEach(song => {
                            data[i].musicList.push(song);
                        });
                    }
                    // console.log('data[i]', data[i]);
                })
                if (i === data.length - 1) {
                    // 等待所有异步完成
                    setTimeout(() => {
                        // console.log('最后data', data);
                        res.json({
                            code: 200,
                            msg: '查询成功',
                            obj: data
                        });
                    }, 200);
                }
            }
        }
    })
});
// 获取音乐详情页里该曲相关歌单
router.get('/getMusicPlaylist', (req, res) => {
    const sql = `
    SELECT
        playlist.id,
        playlist.\`name\`,
        playlist.cover ,
        playlist.description
    FROM
        playlist
        INNER JOIN playlist_music ON playlist.id = playlist_music.playlist_id
        INNER JOIN music ON playlist_music.music_id = music.id 
    WHERE
        playlist_music.music_id = ?
    `;
    const values = [req.query.id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询相关歌单错误'
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
// 根据歌单id获取歌单信息
router.get('/getPlaylistInfo', (req, res) => {
    const sql = `
    SELECT
        playlist.\`name\` AS playlist_name, 
        playlist.description, 
        playlist.user_id, 
        playlist.cover AS playlist_cover, 
        \`user\`.\`name\` AS creater_name
    FROM
        playlist
        INNER JOIN
        \`user\`
        ON 
            playlist.user_id = \`user\`.id
    WHERE
        playlist.id = ?
    `;
    const values = [req.query.playlist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌单信息错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '查询歌单信息成功',
                obj: data
            })
        }
    })
});
// 根据歌单id获取歌单及音乐信息
router.get('/getPlaylistById', (req, res) => {
    const sql = `
    SELECT
        music.id AS music_id, 
        music.\`name\` AS music_name, 
        music.url AS music_url, 
        music.cover AS music_cover, 
        music.lrc AS music_lrc, 
        artist.\`name\` AS artist_name, 
        artist.id AS artist_id
    FROM
        playlist
        INNER JOIN
        playlist_music
        ON 
            playlist.id = playlist_music.playlist_id
        INNER JOIN
        music
        ON 
            playlist_music.music_id = music.id
        INNER JOIN
        artist_music
        ON 
            music.id = artist_music.music_id
        INNER JOIN
        artist
        ON 
            artist_music.artist_id = artist.id
    WHERE
        playlist.id = ?
    `;
    const values = [req.query.playlist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌单错误'
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
// 获得包含某歌手id的歌单
router.get('/getAboutPlaylist', (req, res) => {
    const sql = `
    SELECT
        playlist.id,
        playlist.\`name\`,
        playlist.description,
        playlist.cover 
    FROM
        playlist
        INNER JOIN artist
        INNER JOIN playlist_music ON playlist.id = playlist_music.playlist_id
        INNER JOIN music ON playlist_music.music_id = music.id
        INNER JOIN artist_music ON artist.id = artist_music.artist_id 
        AND music.id = artist_music.music_id 
    WHERE
        artist.id = ? 
    GROUP BY
        playlist.id 
    ORDER BY
        RAND() 
        LIMIT ?
    `;
    const values = [req.query.artist_id, parseInt(req.query.limit)];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器查询歌手相关歌单错误'
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
// 获得其他随机歌单
router.get('/getRandomPlaylist', (req, res) => {
    const sql = `
    SELECT
        playlist.id,
        playlist.\`name\`,
        playlist.cover,
        playlist.description 
    FROM
        playlist 
    WHERE
        playlist.id NOT IN ( ? ) 
    ORDER BY
        RAND() 
        LIMIT ?
    `;
    const values = [req.query.playlist_id, parseInt(req.query.limit)];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询随机歌单错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '查询成功',
                obj: data
            })
        }
    })
})

//分页模糊查询歌单
router.get('/getPlaylistByName', (req, res) => {
    const sql = `SELECT COUNT(*) AS count FROM playlist WHERE name LIKE ?`;
    const values = [`%${req.query.name}%`];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器查询歌单数量错误'
            })
        } else {
            const sql2 = `
            SELECT
                playlist.id AS playlist_id,
                playlist.\`name\` AS playlist_name,
                playlist.user_id,
                playlist.cover,
                \`user\`.\`name\` AS user_name 
            FROM
                playlist
                INNER JOIN \`user\` ON playlist.user_id = \`user\`.id 
            WHERE
                playlist.\`name\` LIKE ?
                LIMIT ?,?
            `;
            const values2 = [`%${req.query.name}%`, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器查询歌单错误'
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

// 获取用户主页歌单信息
router.get('/getUserPageInfo', (req, res) => {
    const sql = `
    SELECT
        playlist.*,
        ( SELECT \`user\`.\`name\` FROM \`user\` WHERE id = playlist.user_id ) AS creater_name,
        ( SELECT COUNT(*) FROM playlist_music WHERE playlist_id = playlist.id ) AS music_number 
    FROM
        playlist
        INNER JOIN playlist_user ON playlist.id = playlist_user.playlist_id
        INNER JOIN \`user\` ON playlist_user.favorite_user_id = \`user\`.id 
    WHERE
        playlist_user.favorite_user_id = ?
    `;
    const values = [req.query.user_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询用户歌单错误'
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
// 创建歌单
router.post('/addPlaylist', (req, res) => {
    const sql = `
    INSERT INTO playlist (\`name\`, cover, user_id) VALUES (?, ?, ?)
    `;
    const values = [req.body.playlist_name, req.body.playlist_cover, req.body.user_id];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器创建歌单错误'
            })
        } else {
            const sql2 = `INSERT INTO playlist_user (playlist_id, favorite_user_id) VALUES (?, ?)`;
            const values2 = [data.insertId, req.body.user_id];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器关联歌单和用户错误'
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '添加歌单成功'
                    })
                }
            })
        }
    })
});
// 删除歌单
router.post('/deletePlaylist', (req, res) => {
    const sql = `DELETE FROM playlist WHERE id = ?`;
    const values = [req.body.playlist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器删除歌单错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '删除歌单成功'
            })
        }
    })
});
// 删除歌单的音乐
router.post('/deleteMusic', (req, res) => {
    const sql = `DELETE FROM playlist_music WHERE playlist_id = ? AND music_id = ?`;
    const values = [parseInt(req.body.playlist_id), req.body.music_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器删除歌单歌曲错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '删除歌单歌曲成功'
            })
        }
    })
});
// 修改歌单
router.post('/updatePlaylist', (req, res) => {
    const sql = `UPDATE playlist SET \`name\` = ?, description = ?, cover = ? WHERE id = ?`;
    const values = [req.body.playlist_name, req.body.description, req.body.playlist_cover, req.body.playlist_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器修改歌单错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '修改歌单成功'
            })
        }
    })
});
// 获取歌单收藏状态
router.get('/getIsFavorite', (req, res) => {
    const sql = `
    SELECT
        COUNT(*) AS count
    FROM
        playlist_user
    WHERE
        playlist_id = ?
        AND favorite_user_id = ?
    `;
    const values = [req.query.playlist_id, req.query.user_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器查询歌单收藏状态错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '查询歌单收藏状态成功',
                obj: data[0].count
            })
        }
    })
});
// 改变收藏歌单状态
router.post('/changePlaylistFavorite', (req, res) => {
    // 判断是添加还是删除
    if (!req.body.is_favorite) {
        const sql = `
        INSERT INTO playlist_user (playlist_id, favorite_user_id) VALUES (?, ?)
        `;
        const values = [req.body.playlist_id, req.body.user_id];
        query(sql, values, (err, data) => {
            if (err) {
                res.json({
                    code: 500,
                    msg: '服务器收藏歌单错误'
                })
            } else {
                res.json({
                    code: 200,
                    msg: '收藏歌单成功'
                })
            }
        })
    } else {
        const sql = `
        DELETE FROM playlist_user WHERE playlist_id = ? AND favorite_user_id = ?
        `;
        const values = [req.body.playlist_id, req.body.user_id];
        query(sql, values, (err, data) => {
            if (err) {
                res.json({
                    code: 500,
                    msg: '服务器取消收藏歌单错误'
                })
            } else {
                res.json({
                    code: 200,
                    msg: '取消收藏歌单成功'
                })
            }
        })
    }
})
module.exports = router;