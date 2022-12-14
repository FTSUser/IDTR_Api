const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const faqSchema = new mongoose.Schema(
    {
      fcid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "faqCategory",
        require: true,
      },
      question: { type: String, require: true },
      answer: { type: String, require: true },
      language: { type: String, require: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      createdBy: {
        type: String,
        default: "Admin",
      },
      updatedBy: {
        type: String,
        default: "Admin",
      },
    },
    {
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model("faq", faqSchema, "faq");
};
