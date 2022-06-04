import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RoleContext from "./PatientContext";
import 'react-alice-carousel/lib/alice-carousel.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RoleContext>
      <App />
    </RoleContext>
);

