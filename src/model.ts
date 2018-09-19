export interface StickyUnit {
    id: number;
    name: string;
    nick: string;
    discription: string;
    icon: string;
    date: Date;
    unread?: number;
}

export interface StickyGroup {
    id: number;
    discription: string;
    icon: string;
}

export interface Sticky {
    id: number;
    date: Date;
    type: number;
    objId: number;
    obj: StickyUnit | StickyGroup;
}

export interface Tie {
    unit: number;
    name: string;
    discription: string;
}

export interface Api {
    name: string;
    url: string;
    token: string;
}

export interface App {
    id: number;
    name: string;
    discription: string;
    icon: string;
    owner: number;
    ownerName: string;
    ownerDiscription: string;
    url: string;
    urlDebug: string;
    apis?: {[name:string]: Api};
}

export interface Message {
    id: number;
    fromUser: number;
    fromUnit: number;
    type: string;
    date: Date;
    subject: string;
    discription: string;
    content: any;
    //read: number;
    state?: string|number;
}

export interface UserBase {
    id: number;
    name: string;
    nick: string;
    icon: string;
}

export interface UnitBase {
    id: number;
    name: string;
    discription: string;
    icon: string;
}

export interface Unit extends UnitBase {
    isOwner: number;
    isAdmin: number;
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    apps: App[];
    messages: Message[];
    unread: number;
}

/*
export interface FollowItem {
    followId: number;
    haoId?: number;
    appId?: number;
    name: string;
    discription?: string;
    icon?: string;
    message?: AppMessage;
    unread?: number;
    appletId?: number;
    isDebug?: boolean;
    url?: string;
    urlDebug?: string;
}

export interface AppMessage {
    id: number;
    time: Date,
    content: string,
    read?: boolean
}
*/