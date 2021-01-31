import React, { ReactNode } from 'react';

import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import './index.less';
import { RouterConfig } from './RouteConfig';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Location, State } from "history";

/**
 * 过渡动画切换路由组件，注意切换的两个路由组件必须有同一个父元素
 */
export interface RouteConfigInterface {
    path: string;
    component: any;
    animationConfig?: {
        enter: string;
        exit: string;
    };
    [propName: string]: any;
}

const DEFAULT_SCENE_CONFIG = {
    enter: 'from-right', // 新增时动画类名片段
    exit: 'to-exit' // 卸载时动画类名片段
};

const getAnimationConfig = (location: Location<State>) => {
    const matchedRoute = RouterConfig.find(config => new RegExp(`^${config.path}$`).test(location.pathname));
    return (matchedRoute && matchedRoute.animationConfig) || DEFAULT_SCENE_CONFIG;
};

let oldLocation: Location<State> | null = null;
const Routes = withRouter(({ location, history }) => {

    // 转场动画应该都是采用当前页面的animationConfig，所以：
    // push操作时，用新location匹配的路由的animationConfig
    // pop操作时，用旧location匹配的路由的animationConfig
    let classNames = '';
    if (history.action === 'PUSH') {
        classNames = 'forward-' + getAnimationConfig(location).enter;
    } else if (history.action === 'POP' && oldLocation) {
        classNames = 'back-' + getAnimationConfig(oldLocation).exit;
    }

    // 更新旧location
    oldLocation = location;

    return (
        <TransitionGroup
            className={'router-wrapper'}
            childFactory={child => React.cloneElement(child, { classNames })} // 动态替换孩子的classNames（目的是让待删除和即将进来的组件有各自的动画classNames）
        >
            <CSSTransition
                // in={ } // 切换开关
                // classNames="" // 动画片段
                timeout={500} // 延时
                key={location.pathname}
            >
                <Switch location={location}>
                    {RouterConfig.map((config: RouteConfigInterface, index: number) => (
                        <Route exact key={index} {...config} />
                    ))}
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
});

export default React.memo(Routes);
