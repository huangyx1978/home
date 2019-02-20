import * as React from 'react';

export function userSpan(name:string, nick:string):JSX.Element {
    return nick?
        <><b>{nick}</b> &nbsp; <small className="muted">{name}</small></>
        : <b>{name}</b>;
}
