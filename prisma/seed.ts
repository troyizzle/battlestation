import { prisma } from "../src/server/db";

async function main() {
  await prisma.submission.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.participant.deleteMany()

  const participants = [
    {
      data: {
        username: 'lilhearthie',
        discriminator: '0513'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068891760132096100/IMG_7655.jpg?width=901&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068772162275639408/IMG_7654.jpg?width=507&height=676'
      ]
    },
    {
      data: {
        username: 'vctus',
        discriminator: '2058'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068541214535716874/IMG_3795.jpg?width=901&height=676'
      ]
    },
    {
      data: {
        username: 'teej',
        discriminator: '4905'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068347106793893969/PXL_20230127_014919680.jpg?width=898&height=676'
      ]
    },
    {
      data: {
        username: 'Mideku',
        discriminator: '6670'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068246094703771758/IMG20230126190651.jpg?width=901&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068246095068659746/IMG20230126190713.jpg?width=901&height=676'
      ]
    },
    {
      data: {
        username: 'SteezeCamp',
        discriminator: '2860'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068212869486870548/PXL_20230126_164334640.jpg?width=898&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068212869709189240/PXL_20230126_164403137.jpg?width=898&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068212869931483237/PXL_20230126_164413263.jpg?width=898&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068212870183125082/PXL_20230126_164426154.jpg?width=898&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068212870447386684/PXL_20230126_164518453.NIGHT.jpg?width=898&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068212870682263632/PXL_20230126_164538033.NIGHT.jpg?width=509&height=676'
      ]
    },
    {
      data: {
        username: 'me, faygo dave',
        discriminator: '3315'
      },
      submission: [
        'https://media.discordapp.net/attachments/521111377146806285/1068202072358527037/498122BD-C76C-4A69-9A89-56D55DA5522C.png?width=380&height=676',
        'https://media.discordapp.net/attachments/521111377146806285/1068202073168035960/E838494B-8AA9-4FCC-AFB7-C6BDDECED48C.png?width=380&height=676'
      ]
    }
  ]

  participants.forEach(async (participant) => {
    console.log("SAVING!", participant)
    await prisma.participant.create({
      data: {
        ...participant.data,
        submissions: {
          create: participant.submission.map((url) => {
            return {
              url: url
            }
          })
        }
      }
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
