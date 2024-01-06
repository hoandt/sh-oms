import { CommonSidebar } from './CommonSidebar'
import { CommonTopbar } from './CommonTopbar'

export function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
    <CommonSidebar />
    <div className="lg:pl-20">
      <CommonTopbar />
      <main>
        <div className="">
        {children}
        </div>
      </main>
    </div>
  </div>
  )
}
