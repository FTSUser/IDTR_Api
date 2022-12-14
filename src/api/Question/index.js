const addQuestion = require("./add-question");
// const getGalleryById = require("./get-gallery-by-id");
const getAll = require("./get-all");
const getAllQuestion = require("./get-all-question");
const getQuestionByQuestionSet = require("./get-question-by-questionSet");
const generateQuestion = require("./get-generate-question");
const getMonthlyData = require("./get-monthly-data");
const generateQuestionByVcid = require("./get-generate-question-by-vcid");
const updateQuestion = require("./update-question");
const uploadCSV = require("./upload-csv");
const updateStatus = require("./update-status");
const deleteQuestion = require("./delete-question");
// const getAllMenu = require("./get-all-menu")

module.exports = exports = {
  addQuestion,
  getAll,
  getAllQuestion,
  getQuestionByQuestionSet,
  generateQuestion,
  getMonthlyData,
  generateQuestionByVcid,
  updateQuestion,
  uploadCSV,
  updateStatus,
  deleteQuestion,
};
