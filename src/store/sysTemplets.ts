import { Templet } from "./templet";

export const Task_Self = -99;
export const Task_Dispatch = -98;

export const sysTemplets:Templet[] = [
    {
        id: Task_Self,
        name: '$self',
        icon: 'tasks',
        caption: '我的待办',
        discription: undefined,
        content: {
            needTo: false,
        }
    },
    {
        id: Task_Dispatch,
        name: '$dispatch',
        icon: 'share-square',
        caption: '发出任务',
        discription: '给同事的任务',
        content: {
            needTo: true,
        }
    },
];

export const templetDict:{[name:string]:Templet} = {};
for (let t of sysTemplets) {templetDict[t.name] = t;}