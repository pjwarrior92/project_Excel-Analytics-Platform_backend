const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const ChartHistory = require('../models/ChartHistory');

exports.uploadExcel = async (req, res) => {
  try {
    const { xAxis, yAxis, chartType } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = file.path;

    // Read and parse the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save metadata and parsed data to MongoDB
    await ChartHistory.create({
      originalFilename: file.originalname,
      filePath: file.filename,
      parsedData: data,
      xAxis,
      yAxis,
      chartType,
      userId: req.user.id
    });

    res.json({ data });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};