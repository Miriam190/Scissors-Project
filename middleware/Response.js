function responseFormat({res, statusCode, message, data}) {
    return res.status(statusCode).json({
     success: parseInt(statusCode, 10) < 300,
     status: parseInt(statusCode, 10) < 300? "success" : "false",
     statusCode: statusCode,
     data: data,
     message: message || "Request was successful",
    })
}

module.exports = responseFormat