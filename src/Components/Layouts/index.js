import React from 'react';
import OneColumn from './1column';
import TwoColumns from './2columns';
import ThreeColumns from './3columns';

export const LAYOUT_TWO_COLUMNS = '2columns';
export const LAYOUT_THREE_COLUMNS = '3columns';
export const LAYOUT_ONE_COLUMN = '1column';

export const getLayout = (layout, children, layoutConfig = {}, key = 0, border = false) => {
  let LayoutComponent = null;

  if (!children.length) {
    return null;
  }

  switch (layout) {
    case LAYOUT_ONE_COLUMN:
      LayoutComponent = OneColumn;
      break;
    case LAYOUT_TWO_COLUMNS:
      LayoutComponent = TwoColumns;
      break;
    case LAYOUT_THREE_COLUMNS:
      LayoutComponent = ThreeColumns;
      break;
    default:
      console.error('Unknown layout name');
      return null;
  }

  const component = (
    <LayoutComponent key={key} sm={layoutConfig.sm} md={layoutConfig.md} lg={layoutConfig.lg}>
      {children}
    </LayoutComponent>
  );

  return border ? (
    <div className="border p-2 mt-1 mb-1" key={key}>
      {component}
    </div>
  ) : component;
};
