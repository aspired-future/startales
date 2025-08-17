#!/bin/bash

# Fix all remaining direct pool references in src/server/storage/db.ts
# Replace 'await pool.query' with 'const pgPool = getPool(); await pgPool.query'

cd /home/vesh/git_respositories/startales

# Create backup
cp src/server/storage/db.ts src/server/storage/db.ts.backup

# Fix all remaining pool.query references
sed -i 's/const { rows } = await pool\.query(/const pgPool = getPool();\n  const { rows } = await pgPool.query(/g' src/server/storage/db.ts
sed -i 's/await pool\.query(/const pgPool = getPool();\n  await pgPool.query(/g' src/server/storage/db.ts
sed -i 's/const { rows: /const pgPool = getPool();\n  const { rows: /g' src/server/storage/db.ts

# Handle specific patterns
sed -i '/const pgPool = getPool();/{ N; s/const pgPool = getPool();\nconst pgPool = getPool();/const pgPool = getPool();/; }' src/server/storage/db.ts

echo "Fixed PostgreSQL pool references in db.ts"
echo "Backup saved as db.ts.backup"
