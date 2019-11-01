// import client from '../utils/client-utils';
// import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
// import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';
// import { object } from 'prop-types';

export default {
    search(param) {
        let parameters =
            (param.type || param.type === 0 ? '?type=' + param.type : '?') +
            (param.status === 0 ? '&status=' + 0 :
                param.status === 1 ? '&status=' + 1 : '') +
            (param.code ? '&code=' + param.code : '')

        return new Promise((resolve, reject) => {
            clientUtils.requestApi('get', constants.api.voucher.getList + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    getListCode() {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.voucher.getList).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    createCode(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.voucher.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    editVoucher(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.voucher.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getHistory(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi('get', constants.api.voucher.getHistory + '/' + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    importUser(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi('post', constants.api.voucher.importUser, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    generate(param) {
        let parameters =

            (param.prefix ? '?prefix=' + param.prefix : '?prefix=') +
            (param.charters ? '&charters=' + param.charters : null) +
            (param.num ? '&num=' + param.num : '') +
            (param.startTime ? '&startTime=' + param.startTime : '') +
            (param.endTime ? '&endTime=' + param.endTime : '') +
            (param.price ? '&price=' + param.price : '')

        return new Promise((resolve, reject) => {
            clientUtils.requestApi('post', constants.api.voucher.generate + parameters).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    }
}