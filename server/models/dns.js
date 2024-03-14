
const mongoose = require('mongoose');

const DNSSchema = new mongoose.Schema({
    Domain: {
        type: String,
    },
    Type: {
        type: String,
    },
    Value: {
        type: String
    }
    ,
    UserName:{
        type:String
    }
});
const UserDNSSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Data: [DNSSchema] // Array of DNS records
});

const DNS =  mongoose.model("dns", UserDNSSchema);
module.exports = DNS; 