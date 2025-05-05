import { useState } from "react"

function App() {
    const [c,setC]=useState(false);
  return (
    <>
      hi nandhikar
      <button onClick={()=>setC(!c)}>click here</button>
      {c && <p>orewa kaizoku dha</p>}
    </>
  )
}

export default App
