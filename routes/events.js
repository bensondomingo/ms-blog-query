const express = require('express');
const router = express.Router();
const axios = require('axios');

const posts = require('../public/javascripts/postCollections');

const handleEvent = (event) => {
  if (event.type === 'PostCreated') {
    const { id, title } = event.data;
    posts[id] = { id, title, comments: [] };
  } else if (event.type === 'CommentCreated') {
    const { id, content, postId, status } = event.data;
    posts[postId].comments.push({ id, content, status });
  } else if (event.type === 'CommentUpdated') {
    const { id, status, postId, content } = event.data;
    const comment = posts[postId].comments.find((c) => c.id === id);
    comment.status = status;
    comment.content = content;
  }
};

router.post('/', (req, res) => {
  const event = req.body;
  handleEvent(event);
  res.send({ status: 'OK' });
});

axios
  .get('http://localhost:4005/events')
  .then((res) => {
    if (!res.data.length) {
      console.log('NO missed events');
      return;
    }
    res.data.forEach((e) => {
      console.log('Processing event: ', e.type);
      handleEvent(e);
    });
  })
  .catch((err) => console.log(err));

module.exports = router;
