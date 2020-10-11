import * as React from 'react';
import * as PropTypes from 'prop-types';
import SizeAndPositionManager from './SizeAndPositionManager';
import {
    ALIGNMENT,
    DIRECTION,
    SCROLL_CHANGE_REASON,
    marginProp,
    oppositeMarginProp,
    positionProp,
    scrollProp,
    sizeProp,
} from './constants';

const STYLE_WRAPPER = {
    overflow: 'auto',
    willChange: 'transform',
    WebkitOverflowScrolling: 'touch',
};

const STYLE_INNER = {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
};

const STYLE_ITEM = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
};

const STYLE_STICKY_ITEM = {
    ...STYLE_ITEM,
    position: 'sticky'
};

export default class VirtualList extends React.PureComponent {
    static defaultProps = {
        overscanCount: 3,
        scrollDirection: DIRECTION.VERTICAL,
        width: '100%',
    };

    static propTypes = {
        estimatedItemSize: PropTypes.number,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 列表区域宽
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // 列表区域高
            .isRequired,
        itemCount: PropTypes.number.isRequired, // 懒加载的最大条数
        itemSize: PropTypes.oneOfType([ // 列表元素在scrollDirection方向上的尺寸大小
            PropTypes.number,
            PropTypes.array,
            PropTypes.func,
        ]).isRequired,
        onScroll: PropTypes.func,
        onItemsRendered: PropTypes.func,
        overscanCount: PropTypes.number,
        renderItem: PropTypes.func.isRequired,
        scrollOffset: PropTypes.number,
        scrollToIndex: PropTypes.number,
        scrollToAlignment: PropTypes.oneOf([
            ALIGNMENT.AUTO,
            ALIGNMENT.START,
            ALIGNMENT.CENTER,
            ALIGNMENT.END,
        ]),
        scrollDirection: PropTypes.oneOf([
            DIRECTION.HORIZONTAL,
            DIRECTION.VERTICAL,
        ]),
        stickyIndices: PropTypes.arrayOf(PropTypes.number),
        style: PropTypes.object
    };

    itemSizeGetter = (itemSize) => {
        return index => this.getSize(index, itemSize);
    };

    sizeAndPositionManager = new SizeAndPositionManager({
        itemCount: this.props.itemCount,
        itemSizeGetter: this.itemSizeGetter(this.props.itemSize),
        estimatedItemSize: this.getEstimatedItemSize(),
    });

    state = {
        offset:
            this.props.scrollOffset ||
            (this.props.scrollToIndex != null &&
                this.getOffsetForIndex(this.props.scrollToIndex)) ||
            0,
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
    };

    styleCache = {}

    componentDidMount() {
        const { scrollOffset, scrollToIndex } = this.props;
        this.rootNode.addEventListener('scroll', this.handleScroll, {
            passive: true,
        });

        if (scrollOffset != null) {
            this.scrollTo(scrollOffset);
        } else if (scrollToIndex != null) {
            this.scrollTo(this.getOffsetForIndex(scrollToIndex));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            estimatedItemSize,
            itemCount,
            itemSize,
            scrollOffset,
            scrollToAlignment,
            scrollToIndex,
        } = this.props;
        const scrollPropsHaveChanged =
            nextProps.scrollToIndex !== scrollToIndex ||
            nextProps.scrollToAlignment !== scrollToAlignment;
        const itemPropsHaveChanged =
            nextProps.itemCount !== itemCount ||
            nextProps.itemSize !== itemSize ||
            nextProps.estimatedItemSize !== estimatedItemSize;

        if (nextProps.itemSize !== itemSize) {
            this.sizeAndPositionManager.updateConfig({
                itemSizeGetter: this.itemSizeGetter(nextProps.itemSize),
            });
        }

        if (
            nextProps.itemCount !== itemCount ||
            nextProps.estimatedItemSize !== estimatedItemSize
        ) {
            this.sizeAndPositionManager.updateConfig({
                itemCount: nextProps.itemCount,
                estimatedItemSize: this.getEstimatedItemSize(nextProps),
            });
        }

        if (itemPropsHaveChanged) {
            this.recomputeSizes();
        }

        if (nextProps.scrollOffset !== scrollOffset) {
            this.setState({
                offset: nextProps.scrollOffset || 0,
                scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
            });
        } else if (
            typeof nextProps.scrollToIndex === 'number' &&
            (scrollPropsHaveChanged || itemPropsHaveChanged)
        ) {
            this.setState({
                offset: this.getOffsetForIndex(
                    nextProps.scrollToIndex,
                    nextProps.scrollToAlignment,
                    nextProps.itemCount,
                ),
                scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
            });
        }
    }

    componentDidUpdate(_, prevState) {
        const { offset, scrollChangeReason } = this.state;

        if (
            prevState.offset !== offset &&
            scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED
        ) {
            this.scrollTo(offset);
        }
    }

    componentWillUnmount() {
        this.rootNode.removeEventListener('scroll', this.handleScroll);
    }

    scrollTo(value) {
        const { scrollDirection = DIRECTION.VERTICAL } = this.props;

        this.rootNode[scrollProp[scrollDirection]] = value;
    }

    getOffsetForIndex(
        index,
        scrollToAlignment = this.props.scrollToAlignment,
        itemCount = this.props.itemCount,
    ) {
        const { scrollDirection = DIRECTION.VERTICAL } = this.props;

        if (index < 0 || index >= itemCount) {
            index = 0;
        }

        return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
            align: scrollToAlignment,
            containerSize: this.props[sizeProp[scrollDirection]],
            currentOffset: (this.state && this.state.offset) || 0,
            targetIndex: index,
        });
    }

    recomputeSizes(startIndex = 0) {
        this.styleCache = {};
        this.sizeAndPositionManager.resetItem(startIndex);
    }

    render() {
        const {
            estimatedItemSize,
            height,
            overscanCount = 3,
            renderItem,
            itemCount,
            itemSize,
            onItemsRendered,
            onScroll,
            scrollDirection = DIRECTION.VERTICAL,
            scrollOffset,
            scrollToIndex,
            scrollToAlignment,
            stickyIndices,
            style,
            width,
            ...props
        } = this.props;
        const { offset } = this.state;
        const { start, stop } = this.sizeAndPositionManager.getVisibleRange({
            containerSize: this.props[sizeProp[scrollDirection]] || 0,
            offset,
            overscanCount,
        });
        const items = [];
        const wrapperStyle = { ...STYLE_WRAPPER, ...style, height, width };
        const innerStyle = {
            ...STYLE_INNER,
            [sizeProp[scrollDirection]]: this.sizeAndPositionManager.getTotalSize(),
        };

        if (stickyIndices != null && stickyIndices.length !== 0) {
            stickyIndices.forEach((index) =>
                items.push(
                    renderItem({
                        index,
                        style: this.getStyle(index, true),
                    }),
                ),
            );

            if (scrollDirection === DIRECTION.HORIZONTAL) {
                innerStyle.display = 'flex';
            }
        }

        if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
            for (let index = start; index <= stop; index++) {
                if (stickyIndices != null && stickyIndices.includes(index)) {
                    continue;
                }

                items.push(
                    renderItem({
                        index,
                        style: this.getStyle(index, false),
                    }),
                );
            }

            if (typeof onItemsRendered === 'function') {
                onItemsRendered({
                    startIndex: start,
                    stopIndex: stop,
                });
            }
        }

        return (
            <div ref={node => this.rootNode = node} {...props} style={wrapperStyle}>
                <div style={innerStyle}>{items}</div>
            </div>
        );
    }

    handleScroll = (event) => {
        const { onScroll } = this.props;
        const offset = this.getNodeOffset();

        if (
            offset < 0 ||
            this.state.offset === offset ||
            event.target !== this.rootNode
        ) {
            return;
        }

        this.setState({
            offset,
            scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED,
        });

        if (typeof onScroll === 'function') {
            onScroll(offset, event);
        }
    };

    getNodeOffset() {
        const { scrollDirection = DIRECTION.VERTICAL } = this.props;

        return this.rootNode[scrollProp[scrollDirection]];
    }

    getEstimatedItemSize(props = this.props) {
        return (
            props.estimatedItemSize ||
            (typeof props.itemSize === 'number' && props.itemSize) ||
            50
        );
    }

    getSize(index, itemSize) {
        if (typeof itemSize === 'function') {
            return itemSize(index);
        }

        return Array.isArray(itemSize) ? itemSize[index] : itemSize;
    }

    getStyle(index, sticky) {
        const style = this.styleCache[index];

        if (style) {
            return style;
        }

        const { scrollDirection = DIRECTION.VERTICAL } = this.props;
        const {
            size,
            offset,
        } = this.sizeAndPositionManager.getSizeAndPositionForIndex(index);

        return (this.styleCache[index] = sticky
            ? {
                ...STYLE_STICKY_ITEM,
                [sizeProp[scrollDirection]]: size,
                [marginProp[scrollDirection]]: offset,
                [oppositeMarginProp[scrollDirection]]: -(offset + size),
                zIndex: 1,
            }
            : {
                ...STYLE_ITEM,
                [sizeProp[scrollDirection]]: size,
                [positionProp[scrollDirection]]: offset,
            });
    }
}
