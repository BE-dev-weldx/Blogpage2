const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./pool');

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5500, () => {
    console.log("server is listening on 5500");
});

// get users 
app.get("/users", async(req,res) => {
    try{
        const users = await pool.query("select * from users order by user_id asc");
        res.json(users.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// get user by id
app.get("/users/:id", async(req,res) => {
    const u_id = req.params.id;
    try{
        const user_data = await pool.query("select * from users where user_id = $1", [u_id]);
        res.json(user_data.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// get all posts
app.get("/posts", async(req,res) => {
    try{
        const posts = await pool.query("select * from posts order by user_id asc");
        res.json(posts.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// get posts by user_id
app.get("/posts/:id/user", async(req,res) => {
    const u_id = req.params.id;
    try{
        const p_by_id = await pool.query("select * from posts where user_id = $1", [u_id]);
        res.json(p_by_id.rows);
    }
    catch(err){
        console.log(er.message);
    }
});

// get all comments
app.get("/comments_all", async(req,res) => {
    try{
        const cmts = await pool.query("select * from comments_ order by user_id asc");
        res.json(cmts.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// get all comments as per u_id
app.get("/comments/:id", async(req,res) => {
    const u_id = req.params.id;
    try{
        const cmt = await pool.query("select * from comments_ where user_id = $1", [u_id]);
        res.json(cmt.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// insert a new user 
app.post("/users/new_user", async(req,res) => {
    try{
        const u_mail = req.body.email_id;
        const check = await pool.query("select * from users where email_id = $1", [u_mail]);
        if (check.rowCount > 0){
            res.send("user exists");
        }
        else{
            await pool.query("insert into users (user_id, user_name, email_id, pwd, phone_no) values($1,$2,$3,$4,$5)",[
                u_mail.user_id,
                u_mail.user_name,
                u_mail.email_id,
                u_mail.pwd,
                u_mail.phone_no,
            ])
            .then(() => {
                res.status(200).send("user created")
            });
        }
    }
    catch(err){
        console.log(err.message);
    }
});

// insert a new post
app.post("/posts/:id/new_post", async(req,res) => {
    try{
        const u_id = req.params.id;
        const p_body = req.body;
            await pool.query("insert into posts (post_id, post_desc, image_file user_id) values($1,$2,$3,$4)",[
                p_body.post_id,
                p_body.post_desc,
                p_body.image_file,
                u_id,
            ])
            .then(() => {
                res.status(200).send("post created")
            });
        }
    catch(err){
        console.log(err.message);
    }
});

// inserting a new comment
app.post("/comments/:id/new_comment", async(req,res) => {
    try{
        const u_id = req.params.id;
        const c_body = req.body;
            await pool.query("insert into comments_ ( comment_desc, user_id, cmt_id) values($1,$2, $3)",[
                c_body.comment_desc,
                u_id,
                c_body.cmt_id,
            ])
            .then(() => {
                res.status(200).send("comment created")
            });
        }
    catch(err){
        console.log(err.message);
    }
});

// updating an existing user
app.put("/users/:id/user_update", async(req,res) => {
    const u_id = req.params.id;
    try{
        const update = req.body;
        await pool.query("update users set user_name = $1, email_id = $2, pwd = $3, phone_no = $4 where user_id = $5", [
            update.user_name,
            update.email_id,
            update.pwd,
            update.phone_no,
            u_id,
        ])
        .then(() => {
            res.status(201).send("updated user")
        });
    }
    catch(err){
        console.log(err.message);
    }
});

// updating an existing post
app.patch("/posts/:id/post_update", async(req,res) => {
    const p_id = req.params.id;
    try{
        const update = req.body;
        await pool.query("update posts set post_desc = $1, image_file = $2 where post_id = $3", [
            update.post_desc,
            update.image_file,
            p_id,
        ])
        .then(() => {
            res.status(201).send("post updated")
        });
    }
    catch(err){
        console.log(err.message);
    }
});

// updating an existing comment
app.put("/comments/:id", async(req,res) => {
    const c_id = req.params.id;
    try{
        const update = req.body;
        await pool.query("update comments_ set comment_desc = $1 where cmt_id = $2", [
            update.comment_desc,
            c_id,
        ])
        .then(() => {
            res.status(201).send("comment created")
        });
    }
    catch(err){
        console.log(err.message);
    }
});

// delete an user
app.delete("users/delete/:id", async(req,res) => {
    const u_id = req.params.id;
    try{
        await pool.query("delete from users where user_id = $1", [u_id]);
        res.status(204).send("deleted")
    }
    catch(err){
        console.log(err.message);
    }
});

// delete a post
app.delete("posts/delete/:id", async(req,res) => {
    const p_id = req.params.id;
    try{
        await pool.query("delete from posts where post_id = $1", [p_id]);
        res.status(204).send("deleted")
    }
    catch(err){
        console.log(err.message);
    }
});

// delete a comment
app.delete("/comments/delete/:id", async(req,res) => {
    const c_id = req.params.id;
    try{
        await pool.query("delete from comments where cmt_id = $1", [c_id]);
        res.status(204).send("deleted")
    }
    catch(err){
        console.log(err.message);
    }
});