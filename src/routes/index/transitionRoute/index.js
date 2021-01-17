import React from 'react';

import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import './index.less';
import { RouterConfig } from './RouteConfig';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const DEFAULT_TRANSITION_CONFIG = {
    enter: 'from-right', // 新增时动画类名片段
    exit: 'to-exit' // 卸载时动画类名片段
};

const getTransitionConfig = location => {
    const matchedRoute = RouterConfig.find(config => new RegExp(`^${config.path}$`).test(location.pathname));
    return (matchedRoute && matchedRoute.transitionConfig) || DEFAULT_TRANSITION_CONFIG;
};

let oldLocation = null;
const Routes = withRouter(({ location, history }) => {

    // 转场动画应该都是采用当前页面的transitionConfig，所以：
    // push操作时，用新location匹配的路由的transitionConfig
    // pop操作时，用旧location匹配的路由的transitionConfig
    let classNames = '';
    if (history.action === 'PUSH') {
        classNames = 'forward-' + getTransitionConfig(location).enter;
    } else if (history.action === 'POP' && oldLocation) {
        classNames = 'back-' + getTransitionConfig(oldLocation).exit;
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
                timeout={1100} // 延时
                key={location.pathname}
            >
                <Switch location={location}>
                    {RouterConfig.map((config, index) => (
                        <Route exact key={index} {...config} />
                    ))}
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
});

export default React.memo(Routes);
