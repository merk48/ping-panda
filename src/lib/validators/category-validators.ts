import z from "zod"

// In common for frontend $ backend
export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required.")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Category name can only contain leters, numbers or hypens."
  )
