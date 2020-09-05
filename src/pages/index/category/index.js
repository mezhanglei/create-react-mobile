import React, { Component, useState } from 'react';
import { DraggableArea, DraggableAreasGroup } from "@/components/draggable";
import styles from './index.less';
import DragResize from "@/components/drag-layout"
import ClipPictrue from "@/components/clip-pictrue"

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea(111);
const DraggableArea2 = group.addArea(222);

const initialTags = [
    { id: 1, content: 'apple' }, { id: 2, content: 'olive' }, { id: 3, content: 'banana' },
    { id: 4, content: 'lemon' }, { id: 5, content: 'orange' }, { id: 6, content: 'grape' },
    { id: 7, content: 'strawberry' }, { id: 8, content: 'cherry' }, { id: 9, content: 'peach' }];

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTags: [
                { id: 11, content: 'apple', undraggable: true }, { id: 22, content: 'olive' }, { id: 33, content: 'banana' },
                { id: 14, content: 'apple' }, { id: 27652, content: 'olive' }, { id: 35673, content: 'banana' }
            ],
            rightTags: [
                { id: 13, content: 'apple' }, { id: 2753, content: 'olive' }, { id: 3764, content: 'banana' },
                { id: 14641, content: 'apple' }, { id: 56722, content: 'olive' }, { id: 37563, content: 'banana' }
            ]
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
    render() {
        return (
            <>
                <div className={styles["Simple"]}>
                    <DraggableArea
                        tags={initialTags}
                        withHotspot={true}
                        render={({ tag, index }) => (
                            <DragResize>
                                <div className={styles["tag"]}>
                                    {tag.content}
                                </div>
                            </DragResize>
                        )}
                    // onChange={tags => console.log(tags)}
                    />
                </div>
                <div className={styles["Simple"]}>
                    <DraggableArea1
                        tags={this.state.leftTags}
                        render={({ tag }) => (
                            <div className={styles["tag"]}>
                                {tag.content}
                            </div>
                        )}
                        onChange={leftTags => this.setState({ leftTags })}
                    />
                </div>
                <div className={styles["Simple"]}>
                    <DraggableArea2
                        tags={this.state.rightTags}
                        render={({ tag }) => (
                            <div className={styles["tag"]}>
                                <img
                                    className={styles["delete"]}
                                    onClick={() => this.handleClickDelete(tag)}
                                />
                                {tag.content}
                            </div>
                        )}
                        onChange={rightTags => this.setState({ rightTags })}
                    />
                </div>
                <div>
                    <ClipPictrue />
                </div>
            </>
        );
    }
}
