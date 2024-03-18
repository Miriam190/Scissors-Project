const { NotFoundError, ValidationError, ForbiddenError } = require("../middleware/Error");
const UrlSchema = require("../schema/UrlSchema");

const post = async (urldata) => {
    const createUrl = await UrlSchema.create(urldata);
    return createUrl
};

const redirectLink = async (urlId, ipAddress) => {
    const getUrl = await UrlSchema.findOne({ "urlId": urlId });
    if (getUrl) {
        await UrlSchema.updateOne(
            { "urlId": urlId },
            { $inc: { clicks: 1 } },
        );
        const addresses = [];
        addresses.push(ipAddress)
        getUrl.clicker = addresses;
        
        await getUrl.save();
        return getUrl;
    } else {
        throw new ForbiddenError("Unable to access link")
    }

};
module.exports = {
    post,
    redirectLink
}
