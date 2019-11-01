import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    getAll(param) {
        let parameters =
            (param.hospitalId ? '?hospitalId=' + param.hospitalId : '?hospitalId=' + - 1) 
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.serviceType.getAll + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    }, 
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '&page=' + - 1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.name ? '&name=' + param.name : '') +
            (param.type ? '&type=' + param.type : '&type=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.serviceType.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.serviceType.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.serviceType.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.serviceType.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   