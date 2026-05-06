const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const curriculum = require('./curriculum');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    // 1. Run schema.sql
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running schema.sql...');
    await pool.query(schema);
    console.log('Schema applied successfully.');

    // 2. Insert curriculum data
    console.log('Inserting curriculum data...');
    for (const lesson of curriculum) {
      const query = `
        INSERT INTO lessons (title, category, tier, content, task, test_cases, order_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING;
      `;
      const values = [
        lesson.title,
        lesson.category,
        lesson.tier,
        lesson.content,
        lesson.task,
        JSON.stringify(lesson.test_cases),
        lesson.order_index
      ];
      await pool.query(query, values);
    }
    console.log('Curriculum seeded successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    pool.end();
  }
}

seed();
