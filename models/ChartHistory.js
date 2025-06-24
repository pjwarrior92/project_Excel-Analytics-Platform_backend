const mongoose = require('mongoose');

const chartHistorySchema = new mongoose.Schema({
  originalFilename: String,
  filePath: String, // Local filename (e.g. 1723456000-report.xlsx)
  parsedData: Array,
  xAxis: String,
  yAxis: String,
  chartType: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChartHistory', chartHistorySchema);
