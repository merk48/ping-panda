import { ArrowLeft } from "lucide-react"
import { ReactNode } from "react"
import { Button } from "./ui/button"
import { Heading } from "./heading"

interface DashboardPageProps {
  title: string
  children: ReactNode
  hideBackButton?: boolean
  cta?: ReactNode
}

export default function DashboardPage({
  title,
  hideBackButton,
  children,
  cta,
}: DashboardPageProps) {
  return (
    <section className="flex-1 h-full flex flex-col">
      <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 ">
          <div className="flex items-center gap-8">
            {hideBackButton ? null : (
              <Button variant="outline" className="w-fit bg-white">
                <ArrowLeft className="size-4 t" />
              </Button>
            )}
            <Heading>{title}</Heading>
          </div>
          {cta ? <div className="w-full">{cta}</div> : null}
        </div>
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}
