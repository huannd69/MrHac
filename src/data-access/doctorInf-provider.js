import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.queryString ? '&queryString=' + param.queryString : '') +
            (param.specialistId ? '&specialistId=' + param.specialistId : '&specialistId=' + - 1) +
            '&active=' + (param.active == undefined ? -1 : param.active ? param.active : 0) +
            (param.type ? '&type=' + param.type : '&type=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.doctorInf.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.doctorInf.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    reject(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.doctorInf.reject + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    active(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.doctorInf.active + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}