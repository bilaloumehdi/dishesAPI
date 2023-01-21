const express = require('express') ;
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000','https://localhost:3443'];

const crosOptionsDelegate = (req, callback) => {
    let crosOptions ;
    if(whiteList.indexOf(req.header('origin') !== -1 )){
        crosOptions ={ origin: true};
    }else {
        crosOptions ={ origin: false}
    }
    callback(null, crosOptions);
}

module.exports.cors = cors();
module.exports.corsWithOptions = cors(crosOptionsDelegate);