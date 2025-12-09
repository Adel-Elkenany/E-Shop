const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const prismaClientPath = path.resolve(__dirname, '..', 'node_modules', '.prisma', 'client');
  const prismaClientExists = fs.existsSync(prismaClientPath);

  const envHasDb = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';

  if (envHasDb) {
    console.log('DATABASE_URL detected — running "npx prisma generate"...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  } else if (!prismaClientExists) {
    console.log('.prisma client not found — running "npx prisma generate" to create client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  } else {
    console.log('Skipping prisma generate: .prisma client exists and DATABASE_URL not set.');
  }
  // After generation, ensure @prisma/client package can require the generated client
  try {
    const generatedSrc = path.resolve(__dirname, '..', 'node_modules', '.prisma', 'client');
    const prismaClientPackagePath = path.resolve(__dirname, '..', 'node_modules', '@prisma', 'client');
    const dest = path.join(prismaClientPackagePath, '.prisma', 'client');

    if (fs.existsSync(generatedSrc)) {
      // create destination directory
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      // copy recursively (Node 16+ supports fs.cpSync)
      if (fs.cpSync) {
        fs.cpSync(generatedSrc, dest, { recursive: true });
      } else {
        // fallback: copy files one by one
        const copyRecursive = (src, dst) => {
          const entries = fs.readdirSync(src, { withFileTypes: true });
          fs.mkdirSync(dst, { recursive: true });
          for (const ent of entries) {
            const srcPath = path.join(src, ent.name);
            const dstPath = path.join(dst, ent.name);
            if (ent.isDirectory()) copyRecursive(srcPath, dstPath);
            else fs.copyFileSync(srcPath, dstPath);
          }
        };
        copyRecursive(generatedSrc, dest);
      }
      console.log('Copied generated Prisma client into @prisma/client package path.');
    }
  } catch (copyErr) {
    console.warn('Failed to copy generated Prisma client into @prisma/client package:', copyErr && copyErr.message ? copyErr.message : copyErr);
  }
} catch (err) {
  console.error('prisma generate failed:', err && err.message ? err.message : err);
  // Do not fail the postinstall step — keep non-fatal exit
  process.exit(0);
}
