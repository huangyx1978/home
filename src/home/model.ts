export const sysUnit:StickyUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
    date: undefined,
}

export interface StickyUnit {
    id: number;
    name: string;
    nick: string;
    discription: string;
    icon: string;
    date: Date;
    unread?: number;
    subject?: string;
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
export interface UserBase {
    id: number;
    name: string;
    nick: string;
    icon: string;
}
export interface App {
    id: number;
    name: string;
    caption: string;
    discription: string;
    icon: string;
    owner: number;
    ownerName: string;
    ownerDiscription: string;
    url: string;
    urlDebug: string;
    //apis?: {[name:string]: Api};
}
export interface Grant {
    allowDev: number;
    sumDev: number;
    allowUnit: number;
    sumUnit: number;
}
/*
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
    //apps: App[];
    //messages: Message[];
    unread: number;
}
*/

