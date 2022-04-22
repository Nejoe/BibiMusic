-- 创建音乐表
CREATE TABLE music (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    cover VARCHAR(255),
    lrc TEXT,
    PRIMARY KEY (id)
);
-- 创建用户表
CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    account VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_admin INT NOT NULL,
    PRIMARY KEY (id)
);
-- 创建歌手表
CREATE TABLE artist (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    photo VARCHAR(255),
    avatar VARCHAR(255),
    PRIMARY KEY (id)
);
-- 创建歌单表,和用户表是多对一的关系
CREATE TABLE playlist (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id INT NOT NULL,
    cover VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
-- 创建评论表，和用户表是多对一的关系，和歌曲表是多对一的关系
CREATE TABLE comment (
    id INT NOT NULL AUTO_INCREMENT,
    content VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    music_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (music_id) REFERENCES music(id)
);
-- 创建歌单歌曲关联表，外键是歌单表，歌曲表
CREATE TABLE playlist_music (
    id INT NOT NULL AUTO_INCREMENT,
    playlist_id INT NOT NULL,
    music_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- 创建歌手歌曲关联表，外键是歌手表，歌曲表，外键约束为cascade
CREATE TABLE artist_music (
    id INT NOT NULL AUTO_INCREMENT,
    artist_id INT NOT NULL,
    music_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- 重置id自增
ALTER TABLE music AUTO_INCREMENT = 1;
-- 添加歌手
INSERT INTO artist (name, description, photo, avatar)
VALUES ('薛之谦', '华语歌手薛之谦', '', '');
-- 删除歌手
DELETE FROM artist
WHERE id = 1;
-- 修改歌手信息
UPDATE artist
SET name = '薛之谦',
    description = '华语歌手薛之谦'
WHERE id = 1;
-- 查询歌手
SELECT id,
    name,
    description,
    photo,
    avatar
FROM artist;
-- 关联歌手和歌曲
INSERT INTO artist_music (artist_id, music_id)
VALUES (1, 1);
-- 添加评论
INSERT INTO comment (content, user_id, music_id)
VALUES ('这首歌很好听', 1, 1);
-- 删除评论
DELETE FROM comment
WHERE id = 1;
-- 查询评论
SELECT id,
    content,
    user_id,
    music_id
FROM comment;
-- 添加歌曲
INSERT INTO music (name, url, cover, lrc)
VALUES (
        '梦想的声音',
        'http://music.163.com/song/media/outer/url?id=14086.mp3',
        'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
        'http://music.163.com/song/media/outer/url?id=14086.lrc'
    );
-- 删除歌曲
DELETE FROM music
WHERE id = 1;
-- 修改歌曲信息
UPDATE music
SET name = '梦想的声音',
    url = 'http://music.163.com/song/media/outer/url?id=14086.mp3',
    cover = 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
    lrc = 'http://music.163.com/song/media/outer/url?id=14086.lrc'
WHERE id = 1;
-- 查询歌曲
SELECT id,
    name,
    url,
    cover,
    lrc
FROM music;
-- 添加歌单
INSERT INTO playlist (name, description, user_id, cover)
VALUES (
        '我喜欢的音乐',
        '我喜欢的音乐',
        1,
        NULL
    );
-- 查询歌单id,name,description,cover（为了在首页展示）
SELECT id,
    name,
    description,
    cover
FROM playlist;
-- 关联歌单和歌曲
INSERT INTO playlist_music (playlist_id, music_id)
VALUES (1, 1);
-- 添加用户
INSERT INTO user (account, password, name, is_admin)
VALUES ('admin', 'admin', 'admin', 1);