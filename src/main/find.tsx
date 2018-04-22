import * as React from 'react';

interface Props extends React.HTMLProps<HTMLElement>{
}


export default class Find extends React.Component<Props, null> {
    render() {
        return (
            <div className="p2">
                发现各种资源，正在开发中...
            </div>
        );
    }
}