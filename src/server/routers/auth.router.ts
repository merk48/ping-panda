import { currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { db } from "@/db"

// jstack give us an ubstrack on normal Next.js api route , for type safety, ....

// c is hono-context is a light-wieght node.js framework
export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    const auth = await currentUser()

    // user is synced
    if (!auth) {
      return c.json({ isSynced: false })
    }

    const user = await db.user.findFirst({
      where: { externalId: auth.id },
    })

    // user exsits in our db
    if (!user) {
      await db.user.create({
        data: {
          quotaLimit: 10,
          email: auth.emailAddresses[0].emailAddress,
          externalId: auth.id,
        },
      })

      return c.json({ isSynced: true })
    }

    return c.json({ isSynced: true })
  }),
})
