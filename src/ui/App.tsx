import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GameContainer from './pages/GameContainer';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/menu' element={<MainMenu />} />
        <Route path='/game' element={<GameContainer />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
