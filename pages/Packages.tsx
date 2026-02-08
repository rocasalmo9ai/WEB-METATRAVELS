import React from 'react';
import * as ListModule from './PackagesList';

const PackagesListComponent: any =
  (ListModule as any).PackagesList ||
  (ListModule as any).Packages ||
  (ListModule as any).default;

export const Packages: React.FC = () => {
  return <PackagesListComponent />;
};

export default Packages;
