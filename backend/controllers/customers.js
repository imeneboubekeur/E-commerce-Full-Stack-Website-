const express = require('express');
const pool = require('../database/database');


exports.getCustomers = async (req, res) => {
  try {
    const {
      search,
      status,
      sort = "newest",
      page = 1,
      limit = 10
    } = req.query;

    let query = `
      SELECT id, name, email, phone, address, created_at
      FROM users
      WHERE 1=1
    `;

    const params = [];

    // 🔍 Search
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    // ✅ Status (if you have column)
    if (status && status !== "all") {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    // 🔃 Sorting
    if (sort === "oldest") {
      query += ` ORDER BY created_at ASC`;
    } else if (sort === "name") {
      query += ` ORDER BY name ASC`;
    } else {
      query += ` ORDER BY created_at DESC`; // newest
    }

    // 📄 Pagination
    const offset = (page - 1) * limit;

    params.push(limit);
    query += ` LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // 🔢 Count for pagination
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (name ILIKE $${countParams.length} OR email ILIKE $${countParams.length})`;
    }

    if (status && status !== "all") {
      countParams.push(status);
      countQuery += ` AND status = $${countParams.length}`;
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      customers: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// GET customer by ID
exports.getById= async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, address, created_at
       FROM users
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

// DELETE customer
exports.delete=async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

