import prisma from '../lib/prisma'

async function main() {
  console.log('🔧 Fixing user status values...')
  
  try {
    // Update any users with invalid status
    await prisma.$executeRaw`UPDATE users SET status = 'active' WHERE status NOT IN ('active', 'inactive')`
    console.log('✅ User statuses fixed!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
