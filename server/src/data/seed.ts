import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import { query } from '../db';
import curriculum from './curriculum';

async function seed(): Promise<void> {
  console.log('🌱 Starting curriculum seed...');

  for (const lesson of curriculum) {
    try {
      // Check if lesson already exists
      const existing = await query('SELECT id FROM lessons WHERE id = $1', [lesson.id]);

      if (existing.rows.length > 0) {
        console.log(`⏭️  Lesson ${lesson.id} already exists — skipping.`);
        continue;
      }

      await query(
        `INSERT INTO lessons (id, title, description, language, level, exercises)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          lesson.id,
          lesson.title,
          lesson.description,
          lesson.language,
          lesson.level,
          JSON.stringify(lesson.exercises)
        ]
      );

      console.log(`✅ Seeded lesson: ${lesson.id}`);
    } catch (err: any) {
      console.error(`❌ Error seeding lesson ${lesson.id}:`, err.message);
    }
  }

  console.log('🎉 Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
