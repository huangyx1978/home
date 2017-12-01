import {Api, User, decodeToken} from 'tonva-tools';

class UserApi extends Api {
    login(params: {user: string, pwd: string}) {
        return this.get('login', params)
            .then((token?:string) => {
                if (token !== undefined) return decodeToken(token);
            });
    }
    register(params: {
        nick:string, 
        user:string, 
        pwd:string, 
        country:number, 
        mobile:number, 
        email:string
    })
    {
        return this.post('register', params);
    }
}

let userApi = new UserApi('tv/user/');
export default userApi;
