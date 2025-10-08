import { PrismaClient } from '@prisma/client'

// Prevent multiple instances in development
const globalForPrisma = global || {}

const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },
    errorFormat: 'pretty'
})

// Only attach to global object in development
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma