import Breadcrumb from '@/components/layout/Breadcrumb'

type PageContentProps = {
  children: React.ReactNode
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <main className="page-content">
      <Breadcrumb />
      <div className="page">{children}</div>
    </main>
  )
}
