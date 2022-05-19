const express = require('express');
const router = express.Router();
const query = require('../lib/dbConnection');

// 分页查询宿舍，以及所有宿舍数量
router.get('/getDorm', (req, res) => {
    // 先查询所有宿舍数量
    const sql = 'SELECT COUNT(*) FROM test_dorm';
    query(sql, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '查询宿舍数错误'
            })
        } else {
            if (data[0]['COUNT(*)'] > 0) {
                // 分页查询宿舍
                const total = data[0]['COUNT(*)'];
                const values = [(req.query.page - 1) * req.query.pageSize, parseInt(req.query.pageSize)];
                const sql2 = `SELECT *,( SELECT COUNT(*) FROM test_stu WHERE test_stu.dorm_id = test_dorm.id ) AS num FROM test_dorm LIMIT ?,?`;
                query(sql2, values, (err, data2) => {
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '分页查询宿舍错误'
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
// 分页模糊查询
router.get('/getDormByInfo', (req, res) => {
    // 先查询目标宿舍数量
    const sql = 'SELECT COUNT(*) FROM test_dorm WHERE(test_dorm.id LIKE ? OR test_dorm.`name` LIKE ?)';
    const values = [`%${req.query.info}%`, `%${req.query.info}%`];
    // const sql = 'SELECT COUNT(*), FROM test_dorm WHERE test_dorm.id LIKE ' + `'%12%'` + ' OR test_dorm.`name` LIKE ' + `'%12%'` + 'LIMIT 0,5';
    query(sql, values, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '查询宿舍数错误'
            })
        } else {
            console.log(data[0]['COUNT(*)']);
            if (data[0]['COUNT(*)'] > 0) {
                // 分页查询宿舍
                const total = data[0]['COUNT(*)'];
                const sql2 = 'SELECT *,( SELECT COUNT(*) FROM test_stu WHERE test_stu.dorm_id = test_dorm.id ) AS num FROM test_dorm WHERE test_dorm.id LIKE ? OR test_dorm.`name` LIKE ? LIMIT 0,5';
                query(sql2, values, (err, data2) => {
                    console.log(data2);
                    if (err) {
                        res.json({
                            code: 500,
                            msg: '分页查询宿舍错误'
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
// 获取所有宿舍编号
router.get('/getDormID', (req, res) => {
    const sql = 'SELECT id FROM test_dorm';
    query(sql, (err, data) => {
        if (err) {
            res.json({
                code: 500,
                msg: '获取宿舍编号错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '获取宿舍编号成功',
                obj: data
            })
        }
    })
});
// 添加宿舍
router.post('/addDorm', (req, res) => {
    const sql = `INSERT INTO test_dorm (name,balance,state) VALUES (?, ?, ?)`;
    const values = [req.body.name, req.body.balance, req.body.state];
    query(sql, values, (err, data) => {
        if (err) {
            // 数据库查询失败
            res.json({
                code: 500,
                msg: '添加宿舍失败'
            })
        } else {
            const sql2 = `SELECT COUNT(*) FROM test_dorm`;
            query(sql2, (err, data2) => {
                if (err) {
                    res.json({
                        code: 500,
                        msg: '查询宿舍数错误'
                    })
                } else {
                    const total = data2[0]['COUNT(*)'];
                    res.json({
                        code: 200,
                        msg: '添加宿舍成功',
                        obj: {
                            total
                        }
                    })
                }
            });
        }
    });
});
// 删除宿舍
router.post('/delDorm', (req, res) => {
    const sql = `DELETE FROM test_dorm WHERE id=?`;
    const values = [req.body.id];
    query(sql, values, (err, data) => {
        if (err) {
            // 数据库查询失败
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '删除宿舍成功'
            })
        }
    });
});
// 修改宿舍
router.post('/updateDorm', (req, res) => {
    const sql = `UPDATE test_dorm SET name=? WHERE id=?`;
    const values = [req.body.name, req.body.id];
    query(sql, values, (err, data) => {
        if (err) {
            // 数据库查询失败
            console.log('err', err);
            res.json({
                code: 500,
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: 200,
                msg: '修改宿舍成功'
            })
        }
    });
});
module.exports = router;