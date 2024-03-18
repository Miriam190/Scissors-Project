const formatResponse = require("./Response") 

const errHandler = (err, req, res) => {
    let statusCode = 400;
    if(err.apiError){
        switch (err.name) {
            case "Bad Request":
              statusCode = 400  
                break;
            case "Validation":
              statusCode = 422  
                break;
            case "Not found":
              statusCode = 404  
                break;
            case "Forbidden":
              statusCode = 403  
                break;
            default:
                statusCode = 500
                break;
           
        } 
        console.log(`${statusCode} Status Error --> ${err.name}: ${err.message}`);
      } else {
        console.log(`${statusCode} Status Error --> ${err.name}: ${err.stack}`);
      }
        formatResponse({
            res,
            statusCode: statusCode, 
            message: err.message
        })
    }


module.exports = errHandler