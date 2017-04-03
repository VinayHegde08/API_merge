var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var lims = require('./routes/lims');
//console.log(lims);

var db = mongoose.connect('webtechdevops.centralindia.cloudapp.azure.com:51003/lims');

var MindsData = require('./models/bookModel');
var NewLimsModel = require('./models/newlimsModel');
var WishList = require('./models/wishlistModel');
var IssuedBooks = require('./models/issuedModel');

var app = express();

var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
});

var bookRouter = express.Router();

bookRouter.route('/books')
    // .post(function(req, res) {
    //     var book = new Book(req.body);
    //     console.log(book);
    //     res.send(book);
    // })
    .get(function (req, res) {
        Book.find(function (err, books) {
            if (err)
                res.status(500).send(err);
            else
                res.json(books);
        });
    });

app.use('/api', bookRouter);
// app.route('/getdata').get(function(req, res, next) {
//     MindsData.find()
//         .then(function(doc) {
//             res.send(doc);
//             // console.log(doc);
//         });
// });

app.route('/getdata').get(function (req, res, next) {
    NewLimsModel.find()
        .then(function (doc) {
            res.send(doc);
            // console.log(doc);
        });
});

app.route('/getrecommendation').get(function (req, res, next) {
    NewLimsModel.find({ numberOfCopies: { $eq: 3 } }, { bookId: 1 })
        .then(function (doc) {
            res.send(doc);
            // console.log(doc);
        });
});

// app.route('/addtowishlist/:mid/:isbn').post(function(req, res, next) {
//     WishList.findOneAndUpdate({ mId: { $eq: req.params.mid } }, { $push: { wishList: req.params.isbn } }, function(err, result) {});
// });

app.route('/addtowishlist/:mid/:isbn').get(function (req, res, next) {

    var isbn = req.params.isbn;
    //console.log(isbn);
    var book = [];
    var length;
    WishList.find({ mId: { $eq: req.params.mid } })
        .then(function (doc) {
            //console.log(doc[0].wishList.length);
            book = doc;
            var flag = 0;
            console.log('book ', book[0].wishList.length);
            console.log('length--------- ');
            for (var i = 0; i < book[0].wishList.length; i++) {
                console.log('in for', i);
                if (req.params.isbn === book[0].wishList[i]) {
                    console.log('in if');
                    flag = 1;
                }
            }
            if (flag == 0) {
                console.log('in else 1');
                WishList.findOneAndUpdate({ mId: { $eq: req.params.mid } }, { $push: { wishList: req.params.isbn } }, console.log('------*****'), function (err, result) { });
                console.log('--------->>>>>', book);
                res.send(book);
            } else {
                console.log('in else 2');
                console.log(isbn);
                //res.send('Already present');
                res.json('Already present');
                //WishList.update({ mId: { $eq: req.params.mid } }, { $pull: { wishList: req.params.isbn } }, function(err, result) {});
            }
        });
});

app.route('/getisbndetails/:isbn').get(function (req, res, next) {
    console.log("kushal", req);
    NewLimsModel.find({ isbn: { $eq: req.params.isbn } })
        .then(function (doc) {
            res.send(doc);
        });
});

app.route('/removewishlist/:mid/:isbn').get(function (req, res, next) {

    var isbn = req.params.isbn;
    //console.log(isbn);
    var book = [];
    WishList.update({ mId: { $eq: req.params.mid } }, { $pull: { wishList: req.params.isbn } })
        .then(function (doc) {
            res.send(doc);
            console.log('----->in Remove Wishlist',doc);
        });
});

app.route('/getwishlist/:mid').get(function (req, res, next) {
    WishList.find({ mId: { $eq: req.params.mid } }, { wishList: 1 })
        .then(function (doc) {
            var book = [];
            var i = 0;
            var length = doc[0].wishList.length;
            console.log('------------->', doc[0].wishList.length)
            for (let isbn of doc[0].wishList) {
                console.log('hello', isbn);
                NewLimsModel.find({ isbn: { $eq: isbn } })
                    .then(function (doc) {
                        book[i] = doc;
                        console.log('ola');
                        console.log('loop1', book);
                        i++;
                        if (i == length) {
                            res.send(book);
                        }
                    });
                console.log('loop2', book);
            }
            console.log('loop3', book);
        });
    //console.log('loop4', book);
});

app.route('/recommend/:mId').get(function (req, res, next) {
    IssuedBooks.find({ mId: { $eq: req.params.mId } })
        .then(function (doc) {
            let l = doc.length;
            console.log('----->', doc[l - 1].title);
            NewLimsModel.find({ title: { $eq: doc[l - 1].title } })
                .then(function (doc) {
                    console.log('----->1', doc[0].genre[0]);
                    NewLimsModel.find({ genre: { $eq: doc[0].genre } })
                        .then(function (doc) {
                            res.send(doc);
                        });
                });
        });
});

app.get('/', function (req, res) {
    isbn = "9781451648546";
    console.log(isbn);
    var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    console.log(url);
    res.send('Welcome to API!!!!!');
});

app.listen(port, function () {
    console.log('running on port: ' + port);
});