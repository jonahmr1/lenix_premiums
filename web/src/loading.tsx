import { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import { Spinner } from "./components/ui/spinner"

export function Loading() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      switch (e.data?.eventName) {
        case "loadProgress": {
          console.log(e.data.loadFraction)
          break
        }
        case "onLogLine": {
          console.log(e.data.message)
          break
        }
        case "startDataFileEntries": {
          console.log(e.data.count)
          break
        }
        case "onDataFileEntry": {
          console.log(e.data.name)
          console.log(e.data.type)
          console.log(e.data.isNew)
          break
        }
        case "performMapLoadFunction": {
          console.log(e.data.idx)
          break
        }
        case "endDataFileEntries": {
          console.log("data file entries have ended")
          break
        }
        case "startInitFunction": {
          console.log(e.data.type)
          break
        }
        case "startInitFunctionOrder": {
          console.log(e.data.type)
          console.log(e.data.order)
          console.log(e.data.count)
          break
        }
        case "initFunctionInvoking": {
          console.log(e.data.type)
          console.log(e.data.name)
          console.log(e.data.idx)
          break
        }
        case "initFunctionInvoked": {
          console.log(e.data.type)
          console.log(e.data.name)
          break
        }
        case "endInitFunction": {
          console.log(e.data.type)
          break
        }
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  return (
    <Layout className="h-screen w-full bg-muted">
      <p>
        Loading <Spinner />
      </p>
    </Layout>
  )
}

createRoot(document.getElementById("root")!).render(<Loading />)
