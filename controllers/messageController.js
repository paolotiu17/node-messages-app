const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

const TimeAgo = require('javascript-time-ago');

// English.
const en = require('javascript-time-ago/locale/en');
TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

exports.homepage = [
    (req, res, next) => {
        Message.find()
            .populate('author')
            .exec((err, docs) => {
                const objectDocs = docs.map((doc) => {
                    const newDoc = doc.toObject();
                    if (newDoc.timestamp) {
                        const date = new Date(newDoc.timestamp);
                        newDoc.timestamp = timeAgo.format(date);
                    }

                    return newDoc;
                });

                res.render('home', {
                    messages: objectDocs,
                    user: res.locals.currentUser,
                });
            });
    },
];

exports.save_message = [
    (req, res, next) => {
        const values = req.body;

        const newMessage = new Message({
            ...values,
            timestamp: Date.now(),
            author: req.user._id,
        });
        newMessage.save((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    },
];
