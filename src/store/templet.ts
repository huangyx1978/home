
export interface Templet {
    id: number;
    icon: string;
    name: string;
    caption: string;
    discription: string;
    content: Job;
}

export interface Job {
    needTo: boolean;
}
