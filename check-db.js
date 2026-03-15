const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
Promise.all([
  p.$queryRawUnsafe("SHOW TABLES LIKE 'page_headers'"),
  p.$queryRawUnsafe("SHOW TABLES LIKE 'school_history'"),
]).then(([ph, sh]) => {
  console.log('page_headers:', JSON.stringify(ph));
  console.log('school_history:', JSON.stringify(sh));
  console.log('pageHeader model:', typeof p.pageHeader);
}).catch(e => console.log('err', e.message))
  .finally(() => p.$disconnect());
