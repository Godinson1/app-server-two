CREATE TABLE posts (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    handle VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    photoUrl TEXT,
    likes INTEGER NOT NULL,
    createdAt DATE NOT NULL DEFAULT NOW(),
    updatedAt DATE NOT NULL DEFAULT NOW()
);

INSERT INTO posts (admin_id, fullname, handle, content, photoUrl, likes) VALUES ($1, $2, $3, $4, $5, $6)
UPDATE posts SET content = $1, photoUrl = $2 WHERE admin_id = $3;
DELETE FROM posts WHERE admin_id = $1;