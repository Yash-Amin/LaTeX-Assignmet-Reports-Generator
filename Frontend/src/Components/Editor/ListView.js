import React, { Component } from 'react';
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';
import arrayMove from 'array-move';

// const SortableItem = SortableElement(({ value }) => {
//     return (
//         <div style={{ border: '1px solid black', padding: '10px' }}>
//             <div>
//                 {value}
//                 <button
//                     style={{ float: 'right' }}
//                     onClick={() => {
//                         console.log(value);
//                     }}
//                 >
//                     Delete
//                 </button>
//             </div>
//             <textarea rows={5} />
//         </div>
//     );
// });

import Theory from './Theory';

const SortableItem = SortableElement(({ value }) => {
    return  <Theory text={value.text} type={value.type} />
    
    
});

const SortableList = SortableContainer(({ items }) => {
    // console.log(SortableItem);
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    value={value}
                />
            ))}
        </ul>
    );
});

export class ListView extends Component {
    state = {
        items: [
            { id: 1,type:'paragraph', text: 'Hello World 1' },
            { id: 2,type:'java', text: '<script>alert(1)</script>' },
            { id: 3,type:'paragraph', text: 'Hello World 2' },
            { id: 4,type:'paragraph', text: 'Hello World 3' }
        ]
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex)
            this.setState(({ items }) => ({
                items: arrayMove(items, oldIndex, newIndex)
            }));
    };

    onItemClick = () => {
        console.log('Item Clicked!');
    };

    shouldComponentUpdate(newState, newProps) {
        console.log('[SHOULD UPDATE] ', newState, this.state);
        return newState != this.state;
    }

    render() {
        return (
            <div>
                <SortableList
                    useDragHandle
                    items={this.state.items}
                    onSortEnd={this.onSortEnd}
                />
            </div>
        );
    }
}

export default ListView;
