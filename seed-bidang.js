const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const existing = await p.wakilBidang.count()
  if (existing === 0) {
    await p.wakilBidang.createMany({
      data: [
        { name: 'Kurikulum', orderPosition: 1 },
        { name: 'Kesiswaan', orderPosition: 2 },
        { name: 'Humas dan Industri (Hubin)', orderPosition: 3 },
        { name: 'Sarana dan Prasarana', orderPosition: 4 },
      ],
    })
    console.log('Seeded 4 default bidang wakil kepsek')
  } else {
    console.log('Bidang already has ' + existing + ' records, skip')
  }
  await p.$disconnect()
}

main().catch(e => { console.error(e); p.$disconnect(); process.exit(1) })
