import styles from './resize-image.less';
import { useRef, useEffect } from "react";
import objectFitImages from "object-fit-images";

/**
 * 自动裁剪解决显示变形的图片组件(必须要设置宽高)
 * 
 * src: 显示图片路径
 * defaultSrc: 默认显示图片路径
 * @param {*} props 
 */
const ResizeImage = ({ src, defaultSrc, ...rest }) => {

    const imgRef = useRef();

    if (!props.width || !props.height) {
        console.error('please set width and height for img');
    }

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

    return <img className={styles['img']} ref={imgRef} onError={e => imgErrorFun(e)} src={imgSrc || defaultSrc} {...rest} />;
};

export default ResizeImage;
