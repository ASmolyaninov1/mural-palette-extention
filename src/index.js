import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import { Provider as AlertProvider, positions } from 'react-alert'
import { Notification } from "components"

const init = () => {
  const image = `%3csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3e%3cpath d='M24 6c-9.94 0-18 8.06-18 18s8.06 18 18 18c1.66 0 3-1.34 3-3 0-.78-.29-1.48-.78-2.01-.47-.53-.75-1.22-.75-1.99 0-1.66 1.34-3 3-3h3.53c5.52 0 10-4.48 10-10 0-8.84-8.06-16-18-16zm-11 18c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6-8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm10 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/%3e%3cpath d='M0 0h48v48h-48z' fill='none'/%3e%3c/svg%3e`

  window.muralSdk.register.sidebar.buttons({
    description: 'Brand Pallet',
    SVGicon: image,
    name: 'labscolourpalletsidebar',
    title: 'Brand Colour Pallet',
    tooltipText: 'Brand Colour Pallet',
    ariaLabelText: 'Brand Colour Pallet',
    component: '/'
  });
};

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={Notification} position={positions.BOTTOM_CENTER}>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

window.muralSdk.onReady(init);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();