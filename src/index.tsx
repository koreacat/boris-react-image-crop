import React from 'react';
import ReactDOM from 'react-dom/client';
import ImageCrop from './lib/ImageCrop';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<ImageCrop/>);
