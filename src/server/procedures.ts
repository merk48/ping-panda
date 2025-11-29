import { currentUser } from "@clerk/nextjs/server"
import { j } from "./__internals/j"
import { db } from "@/db"
import { HTTPException } from "hono/http-exception"

const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    // bearer <API_KEY>
    const apiKey = authHeader.split(" ")[1]

    const user = await db.user.findUnique({
      where: { apiKey },
    })

    // User exsists in db
    if (user) return next({ user })
  }

  // user is not exsists in db => check if user authonticated with clerk
  const auth = await currentUser()

  // Not authonticated with clerk
  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({ where: { externalId: auth.id } })

  // Authonticated with clerk but not logged in
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  // Authonticated with clerk and Logged in
  return next({ user })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)
