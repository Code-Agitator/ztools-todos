import { useEffect, useState } from 'react'
import Hello from './Hello'
import Read from './Read'
import Write from './Write'
import TodoApp from './components/TodoApp'

export default function App() {
  const [enterAction, setEnterAction] = useState<any>({})
  const [route, setRoute] = useState('')

  useEffect(() => {
    window.ztools.onPluginEnter((action) => {
      setRoute(action.code)
      setEnterAction(action)
    })
    window.ztools.onPluginOut(() => {
      setRoute('')
    })
  }, [])

  if (route === 'hello') return <Hello enterAction={enterAction} />
  if (route === 'read') return <Read enterAction={enterAction} />
  if (route === 'write') return <Write enterAction={enterAction} />
  if (route === 'todo') return <TodoApp />

  return null
}
