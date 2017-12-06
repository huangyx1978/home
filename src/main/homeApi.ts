import {CenterApi, User} from 'tonva-tools';

class HomeApi extends CenterApi {
    items() {
        return this.get('items', undefined);
            // .then(res => res); //this.getItems(res));
    }
    loadFollows(pageSize:number, minName:string) {
        return this.get('follows', {pageSize:pageSize, minName: minName});
    }
    tieHao(tie:number) {
        return this.get('tie-hao', {tie: tie});
    }
    toHome(tie:number) {
        return this.post('to-home', {tie: tie});
    }
    dbInit() {
        return this.get('dbInit', undefined).then(res => res);
    }
}

let homeApi = new HomeApi('api/home/');
export default homeApi;
