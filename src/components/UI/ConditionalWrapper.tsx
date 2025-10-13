import React from 'react';
const ConditionalWrapper: (props: {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}) => React.ReactNode = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);
export default ConditionalWrapper;
