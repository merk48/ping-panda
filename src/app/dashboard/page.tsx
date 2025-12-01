import DashboardPage from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardPageContent } from "./components/dashboard-page-content"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CreateEventCategoryModal } from "@/components/create-event-category-modal"
import { createCheckoutSession } from "@/lib/stripe"
import { PaymentSuccessModal } from "@/components/payment-success-modal"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
    // intent: string
    // success: boolean
  }
}

export default async function Page({ searchParams }: PageProps) {
  const auth = await currentUser()

  if (!auth) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) redirect("/sign-in")

  const intent = searchParams.intent

  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    if (session.url) redirect(session.url)
  }

  const success = searchParams.success
  console.log(success)
  return (
    <>
      {success ? <PaymentSuccessModal /> : null}
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="size-4 mr-2" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  )
}
