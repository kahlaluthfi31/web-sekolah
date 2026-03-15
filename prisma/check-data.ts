import prisma from '../lib/prisma'

async function check() {
  const newsCount = await prisma.news.count()
  const agendaCount = await prisma.agenda.count()
  const alumniCount = await prisma.alumniSubmission.count()
  const majorCount = await prisma.major.count()
  const competencyCount = await prisma.competency.count()
  //const partnerCount = await prisma.partner.count()

  console.log('\n📊 Database Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📰 News: ${newsCount}`)
  console.log(`📅 Agenda: ${agendaCount}`)
  console.log(`🎓 Alumni: ${alumniCount}`)
  console.log(`🏫 Majors: ${majorCount}`)
  console.log(`📚 Competencies: ${competencyCount}`)
  //console.log(`🤝 Partners: ${partnerCount}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
