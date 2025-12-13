#!/usr/bin/env node
/*
 Usage:
  node scripts/hash-seller-password.js --email seller@example.com --password newPassword

 This script will hash the provided password with bcrypt and update the seller record
 in the database using Prisma. It is intended for development use only.
*/
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

function parseArgs() {
    const args = process.argv.slice(2);
    const out = {};
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === '--email') {
            out.email = args[++i];
        } else if (a === '--password') {
            out.password = args[++i];
        }
    }
    return out;
}

async function main() {
    const { email, password } = parseArgs();
    if (!email || !password) {
        console.error('Usage: node scripts/hash-seller-password.js --email seller@example.com --password newPassword');
        process.exit(1);
    }

    const prisma = new PrismaClient();
    try {
        const hashed = await bcrypt.hash(password, 10);
        const updated = await prisma.sellers.updateMany({
            where: { email },
            data: { password: hashed },
        });

        if (updated.count === 0) {
            console.error('No seller found with that email.');
            process.exit(2);
        }

        console.log(`Updated ${updated.count} seller(s) with hashed password for ${email}`);
    } catch (err) {
        console.error('Error updating seller password:', err);
        process.exit(3);
    } finally {
        await prisma.$disconnect();
    }
}

main();
