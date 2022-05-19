const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

// 分页查询留言，以及所有留言数量
router.get('/getMsg', (req, res) => {
    // 先查询所有留言数量
    const sql = `SELECT COUNT(*) FROM test`;
    query(sql, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '查询留言数错误'
            })
        } else {
            if (data.length > 0) {
                // 分页查询留言
                const total = data[0]['COUNT(*)'];
                console.log(req.query.page);
                const sql2 = `SELECT * FROM test LIMIT ${(req.query.page - 1) * req.query.pageSize},${req.query.pageSize}`;
                query(sql2, (err, data2) => {
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '分页查询留言错误'
                        })
                    } else {
                        res.json({
                            code: 200,
                            msg: '查询成功',
                            obj: {
                                total,
                                data: data2
                            }
                        })
                    }
                });
            } else {
                res.json({
                    code: 204,
                    msg: '无数据'
                })
            }
        }
    });
});
// 添加留言
router.post('/addMsg', (req, res) => {
    const sql = `INSERT INTO test (name, content,time) VALUES ('${req.body.name}', '${req.body.content}', '${req.body.time}')`;
    query(sql, (err, data) => {
        if (err) {
            // 数据库查询失败
            res.json({
                code: 500,
                msg: '添加留言失败'
            })
        } else {
            const sql2 = `SELECT COUNT(*) FROM test`;
            query(sql2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '查询留言数错误'
                    })
                } else {
                    const total = data2[0]['COUNT(*)'];
                    res.json({
                        code: 200,
                        msg: '添加留言成功',
                        obj: {
                            total,
                            data: data
                        }
                    })
                }
            });

        }
    });
});
// 删除留言
router.post('/delMsg', (req, res) => {
    const sql = `DELETE FROM test WHERE id=${req.body.id}`;
    query(sql, (err, data) => {
        if (err) {
            // 数据库查询失败
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '删除留言成功'
            })
        }
    });
});
// 修改留言
router.post('/updateMsg', (req, res) => {
    console.log(req.body);
    const sql = `UPDATE test SET name='${req.body.name}', content='${req.body.content}', time='${req.body.time}' WHERE id=${req.body.id}`;
    query(sql, (err, data) => {
        if (err) {
            // 数据库查询失败
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '修改留言成功'
            })
        }
    });
});
module.exports = router;