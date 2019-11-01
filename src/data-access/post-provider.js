import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

var md5 = require('md5');
export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.queryString ? '&queryString=' + param.queryString : '') +
            (param.status ? '&status=' + param.status : '&status=' + - 1) +
            (param.specialistId ? '&specialistId=' + param.specialistId : '&specialistId=' + - 1) +
            (param.type ? '&type=' + param.type : '&type=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.post.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    }, assign(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.post.assign + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    }, approved(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.post.approved + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    }, approvedList(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.post.approvedList, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   