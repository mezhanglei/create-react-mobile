import styles from './resize-image.less';
import React, { useEffect } from "react";
import objectFitImages from "object-fit-images";
import classNames from "classnames";

/**
 * 自动裁剪解决显示变形的图片组件(必须要设置宽高)
 * 
 * src: 显示图片路径
 * defaultSrc: 默认显示图片路径
 * 其余参数
 * @param {*} props 
 */
const ResizeImage = (props) => {

    const {
        src,
        defaultSrc,
        width,
        height,
        className,
        ...rest
    } = props;

    const imgRef = ref || React.createRef();

    // 图片出错时
    const imgErrorFun = (e) => {
        if (defaultSrc) {
            e.target.src = defaultSrc;
            e.target.onerror = null;
        }
    };

    useEffect(() => {
        objectFitImages(imgRef);
    });

    const imgClass = classNames(styles['resize-img'], className);

    return <img className={imgClass} ref={imgRef} onError={e => imgErrorFun(e)} src={src || defaultSrc} {...rest} />;
};

export default ResizeImage;
