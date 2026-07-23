const Settings = require('../models/settingsModel');

exports.getSettings = async (req, res) => {
  try{
  const { category } = req.params;
  const settings = await Settings.getSettingsByCategory(category);
  res.json(settings);
  }  catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSetting = async (req, res) => {
 try{
  const { key } = req.params;
  const { value } = req.body;

  await Settings.updateSetting(key, value);
  res.json({ success: true });
 } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
