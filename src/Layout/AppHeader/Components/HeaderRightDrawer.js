import React, { useState } from 'react';
import { Elastic } from 'react-burgers';
import Drawer from 'react-motion-drawer';
import RightDrawer from './RightDrawer';

export default function HeaderRightDrawer() {
  const [active, setActive] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  return (
    <>
      <Drawer
        right
        className="drawer-content-wrapper p-0"
        width={450}
        open={openRight}
        onChange={(open) => {
          setOpenRight(open);
          setActive(!active);
        }}
        noTouchOpen={false}
        noTouchClose={false}
      >
        <div className="drawer-nav-btn">
          <Elastic
            width={26}
            lineHeight={2}
            lineSpacing={5}
            color="#6c757d"
            padding="5px"
            active={active}
            onClick={() => {
              setOpenRight(false);
              setActive(!active);
            }}
          />
        </div>
        <RightDrawer close={() => {
          setOpenRight(false);
          setActive(false);
        }}
        />
      </Drawer>
      <div className="header-btn-lg" data-t1="rightDrawerTrigger">
        <Elastic
          width={26}
          lineHeight={2}
          lineSpacing={5}
          color="#6c757d"
          padding="5px"
          active={active}
          onClick={() => {
            setOpenRight(!openRight);
            setActive(!active);
          }}
        />
      </div>
    </>
  );
}
