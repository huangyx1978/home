const ip = "192.168.0.199";

const consts = {
    "serverUrl": ip + ":3000/",
    "systemAdmin": {
        "name": "同花",
        "role": "系统总管",
        "urlDebug": ip + ":3001"
    },
    phonePatter: '/^(0[0-9]{2,3}\\-)?([2-9]([0-9]|\\-){6,8})+(\\-[0-9]{1,4})?$|^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\\-*(\\d|\\-){8}$/',

    form: {
        label: {sm:3, md:2},
        input: {sm: 9, md: 9},
        submit: {
            xs: undefined,
            sm: {offset: 3, size: 3},
            md: {offset: 2, size: 3},
            lg: undefined,
        }
    },

    appIcon: 'http://101.200.46.56/imgs/Bear-icon.png',
    appItemIcon: 'http://101.200.46.56/imgs/Bear-icon.png',
};

export default consts;
