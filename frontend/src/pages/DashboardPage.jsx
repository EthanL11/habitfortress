import BaseBuilder from "../components/BaseBuilder"
import Header from "../components/Header"
export default function DashboardPage() {
  return (
    <div style= {{backgroundColor:"yellow"}}>
      <div>
        <Header/>
      </div>
      <div> 
    <BaseBuilder/>
      </div>
    </div>
  )
}