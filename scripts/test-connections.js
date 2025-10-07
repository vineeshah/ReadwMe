import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

async function testConnection() {
  try {
    // Try to count users as a simple test
    const userCount = await prisma.user.count()
    console.log('Connection successful! User count:', userCount)
  } catch (error) {
    console.error('Connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()