import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfMonth } from "date-fns"
import z from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validators"
import { parseColor } from "@/lib/utils"

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const now = new Date()
    const firstDayOfMonth = startOfMonth(now)

    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
        events: {
          where: { createdAt: { gte: firstDayOfMonth } },
          select: {
            fields: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            events: {
              where: { createdAt: { gte: firstDayOfMonth } },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const categoriesWithCounts = categories.map((category) => {
      const uniqueFieldNames = new Set<string>()
      let lastPing: Date | null = null

      category.events.forEach((event) => {
        Object.keys(event.fields as object).forEach((fieldName) => {
          uniqueFieldNames.add(fieldName)
        })
        if (!lastPing || event.createdAt > lastPing) {
          lastPing = event.createdAt
        }
      })

      return {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        color: category.color,
        updatedAt: category.updatedAt,
        createdAt: category.createdAt,
        uniqueFieldCount: uniqueFieldNames.size,
        eventsCount: category._count.events,
        lastPing,
      }
    })

    return c.superjson({ categories: categoriesWithCounts })
  }),
  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { name } = input

      await db.eventCategory.delete({
        where: {
          name_userId: { name, userId: ctx.user.id },
        },
      })

      return c.json({ success: true })
    }),
  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is requied")
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
        emoji: z.string().emoji("Invalid emojy").optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { name, color, emoji } = input

      //TODO: ADD PAID PLAN LOGIC

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: ctx.user.id,
        },
      })

      return c.json({ eventCategory })
    }),
  insertQuickstartCategories: privateProcedure.mutation(async ({ c, ctx }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: "bug", emoji: "🪲", color: 0xff6b6b },
        { name: "sale", emoji: "💰", color: 0xffeb3b },
        { name: "question", emoji: "🤔", color: 0x6c5ce7 },
      ].map((category) => ({ ...category, userId: ctx.user.id })),
    })

    return c.json({ success: true, count: categories.count })
  }),
})
