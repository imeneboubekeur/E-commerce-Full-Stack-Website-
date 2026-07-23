const pool = require('../database/database');

exports.getSettingsByCategory = async (category) => {
  const { rows } = await pool.query(
    'SELECT key, value FROM settings WHERE category = $1',
    [category]
  );
  return rows;
};

exports.updateSetting = async (key, value) => {
  await pool.query(
    'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2',
    [value, key]
  );
};
