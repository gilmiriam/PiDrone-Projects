var mongoose = require("mongoose");
var Schema = mongoose.Schema; 


mongoose.connect("mongodb://localhost/database"); 


var msgSchema = {autor:String, texto:String}; 
var msg_schema = new Schema(msgSchema); 
var Msg = mongoose.model("Msg", msg_schema);

module.exports.msg = Msg;