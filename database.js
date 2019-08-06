const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://miciudap:9Sqd5hk0FLiPdsUy@cluster0-2mciz.mongodb.net/api?retryWrites=true", {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));
