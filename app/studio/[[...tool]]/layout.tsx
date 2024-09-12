import React from "react";

const StudioLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default StudioLayout;
