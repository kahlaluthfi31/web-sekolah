import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createPartnersTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(255) NULL,
        website_url VARCHAR(255) NULL,
        order_position INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    
    console.log('✅ Table partners created successfully!')

    // Insert sample data
    await prisma.$executeRawUnsafe(`
      INSERT INTO partners (name, logo_url, website_url, order_position, is_active) 
      VALUES 
        ('Google', 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', 'https://google.com', 1, 1),
        ('Microsoft', 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31', 'https://microsoft.com', 2, 1),
        ('Oracle', 'https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png', 'https://oracle.com', 3, 1)
      ON DUPLICATE KEY UPDATE name=name;
    `)
    
    console.log('✅ Sample partner data inserted!')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createPartnersTable()
