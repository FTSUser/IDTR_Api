const mongoose = require("mongoose");

 module.exports = (connection) => {
     const verificationCodeSchema = new mongoose.Schema({
        //  email: { type: String},
         phone: { type: String },
         code: { type: String, required: true },
         date: { type: Date, required: true },
         expirationDate: { type: Date, required: true },
         failedAttempts: { type: Number, required: true }
     });
 
     // return verificationCodesSchema;
     return connection.model("codeVerification", verificationCodeSchema, "code_verification");
 };
 
// module.exports = (connection) => {
//   const verificationCodeSchema = new mongoose.Schema({
//     phone: { type: String, required: true },
//     code: { type: String, required: true },
//     date: { type: Date, required: true },
//     expirationDate: { type: Date, required: true },
//     failedAttempts: { type: Number, required: true },
//   });

//   // return verificationCodesSchema;
//   return connection.model(
//     "codeVerification",
//     verificationCodeSchema,
//     "code_verification"
//   );
// };
