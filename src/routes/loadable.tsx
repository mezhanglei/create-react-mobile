import React from "react";

// 路由懒加载
export default function loadable(importFn: () => Promise<{ default: any }>, Loading?: React.ReactNode) {
  const AsyncLoadComponent = React.lazy(importFn);
  return (props) => (
    <React.Suspense fallback={Loading || null}>
      <AsyncLoadComponent {...props} />
    </React.Suspense>
  );
};
