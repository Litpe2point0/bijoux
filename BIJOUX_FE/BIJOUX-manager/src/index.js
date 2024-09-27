import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'core-js'

import App from './App'
//import store from './store'
import { store, persistor } from './redux/store';
import useSyncTabs from './useSyncTabs';

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>


// )


const AppWithSync = () => {
  useSyncTabs(); // Sử dụng hook để đồng bộ hóa các tab
  // alert('AppWithSync')
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppWithSync />
    </PersistGate>
  </Provider>
);

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   //<React.StrictMode>
//     <BrowserRouter>
//     <Provider store={store}>
//       <App />
//     </Provider>
//     </BrowserRouter>
//   //</React.StrictMode>
// );