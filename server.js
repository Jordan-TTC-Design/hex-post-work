const http = require('http');
var url = require('url');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/posts');
const header = require('./header');
const { allError } = require('./handlers/errorHandlers');
const { allSuccess, returnDataSuccess } = require('./handlers/successHandlers');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('成功連接資料庫');
  })
  .catch((err) => {
    console.log(err);
  });

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/posts') {
    switch (req.method) {
      case 'GET':
        try {
          const data = await Post.find();
          returnDataSuccess(200, res, '成功取得全部資料', data);
        } catch (err) {
          allError(400, res, err);
        }
        break;
      case 'DELETE':
        try {
          await Post.deleteMany();
          allSuccess(200, res, '成功刪除全部資料');
          res.end();
        } catch (err) {
          allError(400, res, err);
        }
        break;
    }
  } else if (req.url.startsWith('/posts?') && req.method === 'GET') {
    try {
      const query = url.parse(req.url, true).query;
      const { limit } = query;
      const { page } = query;
      const startNum = page * limit - limit;
      const number = await Post.find().count();
      const totalPages = Math.ceil(number / limit);
      const data = await Post.find().skip(startNum).limit(limit);
      res.writeHead(200, header);
      res.write(
        JSON.stringify({
          status: 'success',
          message: '成功取得資料',
          data,
          pagination: {
            total_pages: totalPages,
            current_page: Number(page) ,
            has_pre: page > 1 ? true : false,
            has_next: page < totalPages ? true : false,
            category: '',
          },
        }),
      );
      res.end();
    } catch (err) {
      allError(400, res, err);
    }
  } else if (req.url === '/post') {
    switch (req.method) {
      case 'POST':
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const newPostData = await Post.create(data);
            allSuccess(200, res, '成功新增一筆資料');
          } catch (err) {
            allError(400, res, err);
          }
        });
        break;
    }
  } else if (req.url.startsWith('/post/')) {
    let id = req.url.split('/').pop();
    switch (req.method) {
      case 'GET':
        try {
          const data = await Post.find({ _id: id });
          if (data.length > 0) {
            returnDataSuccess(200, res, '成功取得該筆資料', data);
          } else {
            allError(400, res, '已無該筆資料');
          }
        } catch (err) {
          allError(400, res, err);
        }
        break;
      case 'DELETE':
        try {
          await Post.deleteOne({ _id: id });
          if (data.length > 0) {
            allSuccess(200, res, '成功刪除該筆資料');
          } else {
            allError(400, res, '已無該筆資料');
          }
        } catch (err) {
          allError(400, res, err);
        }
        break;
    }
  } else if (req.method === 'OPTIONS') {
    allSuccess(200, res, '');
  } else {
    allError(404, res, '無此網站路由');
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
