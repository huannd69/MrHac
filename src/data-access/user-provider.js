import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

var md5 = require('md5');
export default {
    getAccountStorage() {
        var user = datacacheProvider.read("", constants.key.storage.current_account);
        return user;
    },
    saveAccountStorage(account) {
        return datacacheProvider.save("", constants.key.storage.current_account, account);
    },
    xx() {
        client.serverApi = "";
    },
    login(emailOrPhone, password) {
        let object = {
            emailOrPhone,
            password: md5(password)
        }
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.login, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.queryString ? '&queryString=' + param.queryString : '') +
            (param.active ? '&active=' + param.active : '&active=' + - 1) +
            (param.specialistId ? '&specialistId=' + param.specialistId : '&specialistId=' + - 1) +
            (param.type ? '&type=' + param.type : '&type=' + - 1) +
            (param.roleId ? '&roleId=' + param.roleId : '&roleId=' + - 1) +
            (param.style ? '&style=' + param.style : '&style=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.user.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    updatePassword(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.updatePassword + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.user.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    block(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.block + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    active(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.active + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    // getDetail(id) {
    //     return new Promise((resolve, reject) => {
    //         clientUtils.requestApi("get", constants.api.user.detail + "/" + id).then(x => {
    //             resolve(x);
    //         }).catch(e => {
    //             reject(e);
    //         })
    //     });
    // },
}   