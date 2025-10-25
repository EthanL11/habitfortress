import BaseBuilder from "../components/BaseBuilder"
import Header from "../components/Header"
import BaseInfo from "../components/BaseInfo"
import SettingsIcon from "../components/SettingsIcon"
import back from "/src/assets/stoneback.png"

import React, { useState } from "react"

export default function DashboardPage() {

  const[zoomScale, setZoomScale] = useState(2.0);
  return (
    <div style= {{backgroundImage:`url(${back})`}}>
      <div>
        <Header/>
      </div>

      <div style={{alignContent: -screenLeft}}>
        <SettingsIcon
        currentZoom={zoomScale}
        setZoom={setZoomScale}
        />
      </div>
      <div style = {{alignContent: screenLeft}}>
        <BaseInfo/>
      </div>
      <div> 
    <BaseBuilder currentZoom={zoomScale}/>
      </div>
    </div>
  )
}