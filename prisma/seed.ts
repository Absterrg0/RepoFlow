import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data
  const repositories = [
    {
      name: "Daytona",
      description: "The Open Source Dev Environment Manager.",
      url: "https://github.com/daytonaio/daytona",
      isApproved: true,
      userId: 1,
      techStack: ["Golang"],
    },
    {
      name: "Refact.ai",
      description: "WebUI for Fine-Tuning and Self-hosting of Open-Source Large Language Models for Coding",
      url: "https://github.com/smallcloudai/refact",
      isApproved: true,
      userId: 1,
      techStack: ["AI","Python"],
    },
    {
        name: "Cal.com",
        description: "Scheduling infrastructure for absolutely everyone.",
        url: "https://github.com/calcom/cal.com",
        isApproved: true,
        userId: 1,
        techStack: ["Typescript","NextJs"],
      },
          {
      name: "Remotion",
      description: "Make videos programmatically with React",
      url: "https://github.com/remotion-dev/remotion",
      isApproved: true,
      userId: 1,
      techStack: ["Typescript"],
    },
  ];

  // Seed repositories
  for (const repo of repositories) {
    await prisma.repository.create({
      data: repo,
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
