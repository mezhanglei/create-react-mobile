import styles from './resize-image.less';
import { useRef, useEffect } from "react";

/**
 * 自适应大小的图片组件(图片不管尺寸大小，窄边为缩放基准，长边展示中间)
 * 
 * width: 窗口宽
 * height: 窗口高
 * src: 显示图片路径
 * defaultSrc: 默认显示图片路径
 * imgRef: function(dom) {} 将图片的dom传给父组件
 * @param {*} props 
 */
const ResizeImage = (props) => {

    const imgRef = useRef();
    // 默认路径
    const defaultSrc = props.defaultSrc || "";
    // 图片宽高
    const width = props.width || 80;
    const height = props.height || 80;
    // 图片路径
    const imgSrc = props.src || defaultSrc;

    useEffect(() => {
        const img = imgRef.current;
        // 传给父组件
        props.imgRef(img);
        img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            if (imgWidth > imgHeight) {
                img.height = props.height;
                img.classList.add(styles["horizontal"]);
                img.classList.remove(styles['vertical']);
            } else {
                img.width = props.width;
                img.classList.add(styles["vertical"]);
                img.classList.remove(styles['horizontal']);
            }
        };
    }, []);

    // 图片出错时
    const imgErrorFun = (e) => {
        if (defaultSrc) {
            e.target.src = defaultSrc;
            e.target.onerror = null;
        }
    };

    return (
        <div style={{ width: width, height: height }} className={styles['show-window'] + ' ' + props.className}>
            <img ref={imgRef} className={styles['horizontal']} onError={e => imgErrorFun(e)} src={imgSrc} />
        </div>
    );
};

export default ResizeImage;
