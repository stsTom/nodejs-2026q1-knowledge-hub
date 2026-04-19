import { PrismaClient } from '@prisma/client'
import { scryptSync, randomBytes } from 'crypto'

function hash(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const key = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${key}`
}

const prisma = new PrismaClient()

async function main() {
  await prisma.comment.deleteMany()
  await prisma.article.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = hash('Admin1234!')
  const editorPassword = hash('Editor1234!')

  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  const editor = await prisma.user.create({
    data: {
      login: 'editor',
      password: editorPassword,
      role: 'editor',
    },
  })

  const [techCategory, designCategory, businessCategory] = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Articles about software, hardware, and the digital world.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        description: 'UX, UI, graphic design, and creative thinking.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        description: 'Startups, strategy, productivity, and entrepreneurship.',
      },
    }),
  ])

  const [tagJs, tagTs, tagReact, tagAI, tagProductivity, tagCSS, tagStartups] =
    await Promise.all([
      prisma.tag.create({ data: { name: 'JavaScript' } }),
      prisma.tag.create({ data: { name: 'TypeScript' } }),
      prisma.tag.create({ data: { name: 'React' } }),
      prisma.tag.create({ data: { name: 'AI' } }),
      prisma.tag.create({ data: { name: 'Productivity' } }),
      prisma.tag.create({ data: { name: 'CSS' } }),
      prisma.tag.create({ data: { name: 'Startups' } }),
    ])

  const article1 = await prisma.article.create({
    data: {
      title: 'Lorem Ipsum 1',
      content: `Ea labore aliquip nostrud nostrud nulla amet sit id.
Ex laboris nostrud velit laboris pariatur.
Ullamco deserunt deserunt consectetur adipisicing magna in nisi nisi esse.
Veniam nulla ut ipsum aliqua et incididunt pariatur.
Nostrud voluptate cillum laboris ex laborum culpa ad nostrud ullamco aliquip magna minim anim. 
Et cupidatat culpa nulla Lorem sint.
Fugiat qui ad pariatur adipisicing Lorem culpa aliquip tempor qui aliqua enim magna fugiat enim.`,
      status: 'published',
      authorId: admin.id,
      categoryId: techCategory.id,
      tags: { connect: [{ id: tagTs.id }, { id: tagJs.id }] },
    },
  })

  const article2 = await prisma.article.create({
    data: {
      title: 'Lorem Ipsum 2',
      content: `Pariatur laborum duis esse do esse.
Ad eiusmod in consequat enim tempor.
Officia non incididunt nulla et elit minim adipisicing cupidatat do.
Dolor tempor qui commodo anim proident quis nostrud veniam pariatur do consectetur et excepteur est.`,
      status: 'published',
      authorId: editor.id,
      categoryId: designCategory.id,
      tags: { connect: [{ id: tagReact.id }, { id: tagCSS.id }] },
    },
  })

  const article3 = await prisma.article.create({
    data: {
      title: 'Lorem Ipsum 3',
      content: `Nulla exercitation consectetur eiusmod ipsum pariatur consectetur magna nulla.
Adipisicing laborum incididunt exercitation do anim occaecat irure irure Lorem non Lorem adipisicing occaecat ullamco.
Ex enim sint laborum ad id quis qui quis veniam laboris.
Aliquip deserunt occaecat et esse et et.
Non minim qui dolor ea nulla culpa minim occaecat cillum sit.
Lorem enim eiusmod aute amet velit velit eiusmod et labore voluptate nostrud ut.`,
      status: 'published',
      authorId: admin.id,
      categoryId: businessCategory.id,
      tags: { connect: [{ id: tagAI.id }, { id: tagStartups.id }] },
    },
  })

  const article4 = await prisma.article.create({
    data: {
      title: 'Lorem Ipsum 4',
      content: `Non nostrud veniam incididunt laborum reprehenderit cupidatat non reprehenderit amet in est.
Qui cupidatat exercitation laborum commodo.
Dolore adipisicing consectetur duis laborum aliquip enim irure et ipsum id excepteur anim.
Aute veniam eiusmod ea sunt nulla officia eiusmod.`,
      status: 'draft',
      authorId: editor.id,
      categoryId: techCategory.id,
      tags: { connect: [{ id: tagReact.id }, { id: tagTs.id }] },
    },
  })

  const article5 = await prisma.article.create({
    data: {
      title: 'Lorem Ipsum 5?',
      content: `Voluptate enim irure incididunt velit.
Nulla excepteur minim eu consectetur dolore proident amet.
Ex commodo qui eu do commodo incididunt magna adipisicing voluptate.
Aliquip dolor veniam mollit officia adipisicing do duis magna proident.`,
      status: 'archived',
      authorId: admin.id,
      categoryId: businessCategory.id,
      tags: { connect: [{ id: tagProductivity.id }] },
    },
  })

  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Sit incididunt nulla in dolor amet do fugiat cupidatat esse incididunt irure.',
        authorId: editor.id,
        articleId: article1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Elit voluptate aliquip duis in ut ea tempor.',
        authorId: admin.id,
        articleId: article2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Tempor mollit in pariatur ea non minim anim anim id consectetur.',
        authorId: admin.id,
        articleId: article4.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Lorem voluptate sint nulla cupidatat ea fugiat dolor proident veniam reprehenderit tempor esse enim dolore.',
        authorId: editor.id,
        articleId: article5.id,
      },
    }),
  ])
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
