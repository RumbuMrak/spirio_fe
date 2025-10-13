import React, { useState } from 'react';
const Toggler: React.FC<{ defaultState?: boolean; children: (props: { open: boolean; setOpen: (open: boolean) => void }) => JSX.Element }> = ({
  defaultState,
  children,
}) => {
  const [open, setOpen] = useState(defaultState ?? false);
  return <>{children({ open, setOpen })}</>;
};
export default Toggler;
