import Loader from 'react-loaders';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const DefaultLoader = () => (
  <div className="text-center">
    <Loader type="line-scale-party" active />
  </div>
);
