
export interface Sticky {
    id: number;
    date: Date;
    type: number;
    main: string;
    objId: number;
    ex: string;
    icon: string;
    unread: number;
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
    apis?: {[name:string]: Api};
}

export interface UnitApps {
    id: number;
    name: string;
    discription: string;
    icon: string;
    isOwner: number;
    isAdmin: number;
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    apps: App[];
}

export interface UserMessage {
    id: number;
    unit: number;
    type: string;
    date: Date;
    message: any;
    from: {
        id: number;
        name: string;
        nick: string;
        icon: string;
    },
    isNew: boolean;
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