const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Web Development" },
                { name: "Mobile Development" },
                { name: "Music" },
                { name: "Accounting" },
            ]
        })
        console.log("Seeding finished.")
    } catch (error) {
        console.error("Error seeding database: ", error)
    } finally {
        await db.$disconnect()
    }
}
main();