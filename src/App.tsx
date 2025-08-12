import { PayLinksTab } from './components/PayLinksTab'
import { PaymentHistoryTab } from './components/PaymentHistoryTab'
import { Tabs } from './components/ui/tabs'
import { MeritProvider } from './lib/merit-provider'

function App() {
  const tabs = [
    {
      id: 'pay-links',
      label: 'Pay Links',
      content: <PayLinksTab />,
    },
    {
      id: 'payment-history',
      label: 'Payment History',
      content: <PaymentHistoryTab />,
    },
  ]

  return (
    <MeritProvider>
      <div className="h-screen flex flex-col mx-auto container p-8 font-sans">
        <h1 className="text-center text-3xl font-bold text-foreground mb-8 flex items-center justify-center gap-3 flex-shrink-0">
          <img src="/logo.svg" alt="Tiny Merit" className="w-10 h-10" />
          Tiny Merit
        </h1>

        <div className="flex-1 min-h-0">
          <Tabs tabs={tabs} defaultTab="pay-links" />
        </div>
      </div>
    </MeritProvider>
  )
}

export default App
