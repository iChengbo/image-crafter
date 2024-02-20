import { Routes, Route } from 'react-router-dom';

import './App.css'

import Home from './views/home'
import Setting from './views/setting'

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="setting" element={<Setting />} />
      </Route>
    </Routes>
  )
}

export default App

