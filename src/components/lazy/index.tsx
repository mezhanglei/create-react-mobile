import Loadable from "react-loadable";
import { JSXElementConstructor, ReactElement } from 'react';
import React from "react";

// 路由懒加载
type ComponentType = ReactElement<any, string | JSXElementConstructor<any>> | null;
export interface LoadableProps {
  loader: () => ComponentType;
  loading?: ComponentType;
  delay?: number;
  timeout?: number;
  render?: (loaded: { default: any }, props: any) => ComponentType;
  modules?: string[];
}
export default function loadable(configs: LoadableProps) {
  return Loadable({
    loading({ isLoading, error }: { isLoading: boolean; error: boolean }): ComponentType {
      // 加载过程中
      if (isLoading) {
        return <div>loading...</div>;
        // 加载错误
      } else if (error) {
        console.log(error);
        return <div>Sorry, there was a problem loading the page.</div>;
      } else {
        return null;
      }
    },
    ...configs
  });
};
