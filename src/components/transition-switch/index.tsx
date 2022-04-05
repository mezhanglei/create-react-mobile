import React, { ComponentType, CSSProperties } from 'react';

import {
    Route,
    RouteComponentProps,
    Switch,
    withRouter
} from 'react-router-dom';
import './index.less';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Location } from "history";
import { MyRouteProps } from '@/routes';
import { BodyPortal } from '../body-portal';

// 支持的切换类名
const TransitionName = {
    enter_bottom: 'from-bottom',
    exit_bottom: 'to-bottom',
    enter_right: 'from-right',
    exit_right: 'to-right'
}

// 获取动画的切换类
const getAnimationConfig = (location: Location, routes: MyRouteProps[]) => {
    const matchedRoute = routes.find(config => new RegExp(`^${config.path}$`).test(location.pathname));
    const animationConfig = matchedRoute?.animationConfig;
    if (animationConfig) {
        return {
            enter: `forward-${animationConfig.enter}`,
            exit: `back-${animationConfig.exit}`
        }
    }
};

/**
 * 路由过渡动画切换组件，替换路由的Switch组件, 给路由提供切换动画功能
 * 注意: 路由不能懒加载，否则第一次进入页面动画不生效
 */
let oldLocation: Location | null = null;
const TransitionSwitch = withRouter(({ location, history, routes, children }: RouteComponentProps & ComponentType & { routes: MyRouteProps[], children: any }) => {

    // 转场动画应该都是采用当前页面的animationConfig，所以：
    // push操作时，用新location匹配的路由的animationConfig
    // pop操作时，用旧location匹配的路由的animationConfig
    let classNames = '';
    if (history.action === 'PUSH') {
        classNames = getAnimationConfig(location as Location, routes)?.enter || '';
    } else if (history.action === 'POP' && oldLocation) {
        classNames = getAnimationConfig(oldLocation, routes)?.exit || '';
    }

    // 更新旧location
    oldLocation = location as Location;

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
                <Switch>
                    {children}
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
});

export default React.memo(TransitionSwitch);

/**
 * 
 * 浮层弹窗动画组件
 * 使用方式: 传入路由组件，可以在指定组件上添加一个浮层路由组件
 * 注意: 路由不能懒加载，否则第一次进入页面动画不生效
 */
export function TransitionLayer(props: { children: any, routes: MyRouteProps[], style?: CSSProperties }) {
    return (
        <div style={{ position: 'absolute', left: '0px', right: '0px', top: '0px', bottom: '0px' }}>
            {props?.children}
            <BodyPortal style={props?.style}>
                <TransitionSwitch routes={props?.routes}>
                    {
                        props?.routes?.map((item) => (
                            <Route {...item} />
                        ))
                    }
                </TransitionSwitch>
            </BodyPortal>
        </div>
    )
}
