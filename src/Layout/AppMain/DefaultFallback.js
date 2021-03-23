import Loader from 'react-loaders';
import React from 'react';

const DefaultFallback = (
  <div className="loader-container">
    <div className="loader-container-inner">
      <div className="text-center">
        <Loader type="line-scale-party" />
      </div>
    </div>
  </div>
);

export default DefaultFallback;
