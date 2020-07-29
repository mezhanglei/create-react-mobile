import React, { Component, useState } from 'react';
import { DraggableArea } from "@/components/draggable";
import styles from './index.less';


const initialTags = [
    { id: 1, content: 'apple' }, { id: 2, content: 'olive' }, { id: 3, content: 'banana' },
    { id: 4, content: 'lemon' }, { id: 5, content: 'orange' }, { id: 6, content: 'grape' },
    { id: 7, content: 'strawberry' }, { id: 8, content: 'cherry' }, { id: 9, content: 'peach' }];

export default class Main extends Component {
    render() {
        return (
            <div className={styles["Simple"]}>
                <DraggableArea
                    tags={initialTags}
                    withHotspot={true}
                    render={({ tag, index }) => (
                        <div className={styles["tag"]}>
                            {tag.content}
                        </div>
                    )}
                // onChange={tags => console.log(tags)}
                />
            </div>
        );
    }
}
