const userService = require("../service/userService");
const urlService = require("../service/urlService");
const UrlSchema = require("../schema/UrlSchema");
const UserSchema = require("../schema/UserSchema");
const { nanoid } = require("nanoid");
const formatResponse = require("../middleware/Response");
const IP = require('ip');
const QRCode = require("qrcode");
const { isValidHttpUrl } = require("../middleware/validateUrl");
const Cache = require('../config/redis');

module.exports = {
    post: async (req, res, next) => {
        try {
            const BaseUrl = process.env.BASE;
            const origUrl = req.body.origUrl;
            const urlId = req.body.customId || nanoid(5);
            const user = await userService.getOne(req.User.email);

            if (isValidHttpUrl(origUrl) !== true) {
                req.flash("urlInvalid", " ! invalid url. enter a valid url.")
                res.redirect("/api/shortify")

            } else {

                const findUrl = await UrlSchema.find({ "User": req.User.id });
                let foundUrls = [];
                findUrl.forEach((url) => {
                    const urltitle = url.origUrl
                    foundUrls.push(urltitle)
                })

                if (foundUrls.includes(origUrl)) {
                    req.flash("urlFail", "! This url already exists.")
                    res.redirect("/api/shortify/history")
                }

                else {

                    const newUrl = await urlService.post({
                        urlId: urlId,
                        origUrl: origUrl,
                        shortUrl: `${BaseUrl}/${urlId}`,
                        historyUrl: `https://tittle.onrender.com/${urlId}`,
                        User: user._id,
                        createdAt: new Date(),
                    });
                    const savedUrl = await newUrl.save();

                    if (process.env.NODE_ENV !== 'test') {
                        const cacheKey = req.originalUrl;
                        Cache.redis.set(cacheKey, JSON.stringify(savedUrl));
                      }

                    user.URLS = user.URLS.concat(savedUrl.shortUrl);
                    await user.save();

                    const resultLink = savedUrl.urlId;
                    const resultText = savedUrl.historyUrl;
                    const qrresult = savedUrl.historyUrl;

                    QRCode.toDataURL(qrresult, (err, src) => {
                        if (err) res.send("Error occurred");
                        res.render("result", {
                            user: req.User,
                            linkUrl: resultLink,
                            textUrl: resultText,
                            qrcode: src
                        });
                    })
                }
            }

        } catch (err) {
            next(err)
        };
    },

    urlHistory: async (req, res, next) => {
        try {

            const userObj = await UserSchema.findOne({ "_id": req.User.id });
            const user = userObj._id.toString()
            const urls = await UrlSchema.find({ "User": user })

            res.render('urlHistory.ejs', {
                user: req.User,
                url: urls,
                urlFlash: req.flash('urlFail')
            })
        } catch (err) {
            next(err)
        }
    },
    urlAnalytics: async (req, res, next) => {
        try {
            const userObj = await UserSchema.findOne({ "_id": req.User.id });
            const user = userObj._id.toString()
            const urls = await UrlSchema.find({ "User": user })

            res.render('analytics.ejs', {
                user: req.User,
                url: urls
            })

        } catch (err) {
            next(err)
        }
    },

    redirectLink: async (req, res, next) => {
        try {
            const ipAddress = IP.address();
            const URL = await urlService.redirectLink(req.params.urlId, ipAddress);
            res.redirect(URL.origUrl);

        } catch (err) {
            next(err)
        }
    }
};