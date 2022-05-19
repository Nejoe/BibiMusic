const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

router.post('/register', (req, res) => {
    // 查找是否有重复的账号
    const sql = 'SELECT * FROM user WHERE account=?';
    const values = [req.body.account];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '查询重复账号错误'
            })
        } else {
            if (data.length > 0) {
                res.json({
                    code: 201,
                    msg: '账号已存在'
                })
            } else {
                // 插入数据
                const sql3 = `INSERT INTO user (account, password, name, is_admin ,avatar) VALUES (?, ?, ?,0,'http://localhost:3000/upload/images/user_avatar/default.png')`;
                const values3 = [req.body.account, req.body.password, req.body.name];
                query(sql3, values3, (err, data3) => {
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '注册失败'
                        })
                    } else {
                        res.json({
                            code: 200,
                            msg: '注册成功'
                        })
                    }
                });
                // // 查找是否有重复的昵称
                // const sql2 = 'SELECT * FROM user WHERE name=?';
                // const values2 = [req.body.name];
                // query(sql2, values2, (err, data2) => {
                //     if (err) {
                //         res.json({
                //             code: 500,
                //             msg: '查询重复昵称错误'
                //         })
                //     } else {
                //         console.log(data2);
                //         if (data2.length > 0) {
                //             res.json({
                //                 code: 202,
                //                 msg: '昵称已存在'
                //             })
                //         } else {

                //         }
                //     }
                // })
            }
        }
    });
});
router.post('/login', (req, res) => {
    console.log('req.body', req.body);
    const sql = `SELECT id,account,name,is_admin,avatar FROM user WHERE binary account='${req.body.account}' AND binary password='${req.body.password}'`;
    query(sql, (err, data) => {
        if (err) {
            // 数据库查询失败
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            if (data.length > 0) {
                // 登录成功
                res.json({
                    code: 200,
                    msg: '登录成功',
                    obj: data
                })
            } else {
                // 登录失败
                res.json({
                    code: 400,
                    msg: '账号或密码错误',
                    obj: data
                })
            }
        }
    });
});

// 获取用户信息
router.get('/getUserInfo', (req, res) => {
    const sql = `
    SELECT
        \`user\`.id AS user_id, 
        \`user\`.\`name\` AS user_name,
        \`user\`.avatar, 
        \`user\`.description, 
        \`user\`.is_admin
    FROM
        \`user\`
    WHERE
        \`user\`.id = ?
    `;
    const values = [req.query.user_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '获取用户信息成功',
                obj: data
            })
        }
    })
});
// 根据用户名模糊查询用户
router.get('/getUserByName', (req, res) => {
    const sql = `SELECT COUNT(*) AS count FROM user WHERE name LIKE ?`;
    const values = [`%${req.query.name}%`];
    query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                msg: '服务器模糊查询用户数量错误'
            })
        } else {
            const sql2 = `
            SELECT
                \`user\`.id AS user_id, 
                \`user\`.\`name\` AS user_name, 
                \`user\`.avatar, 
                \`user\`.description
            FROM
                \`user\`
            WHERE
                \`user\`.\`name\` LIKE ?
            LIMIT ?, ?
            `;
            const values2 = [`%${req.query.name}%`, (req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
            query(sql2, values2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '服务器模糊查询用户错误'
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
// 修改用户信息
router.post('/updateUser', (req, res) => {
    const sql = `UPDATE user SET name=?,avatar=?,description=? WHERE id=?`;
    const values = [req.body.user_name, req.body.avatar, req.body.description, req.body.user_id];
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '服务器修改用户信息错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '修改用户信息成功'
            })
        }
    })
})
module.exports = router;