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
            '&status=' + (param.status == undefined ? '' : param.status ? param.status : '') +
            '&statusPay=' + (param.statusPay == undefined ? '' : param.statusPay>=0 ? param.statusPay : '') +
            // (param.status ? '&status=' + param.status : '&status=' + - 1) +
            (param.stype ? '&stype=' + param.stype : '&stype=' + - 1) +
            (param.hospitalId ? '&hospitalId=' + param.hospitalId : '&hospitalId=' + - 1) +
            (param.codeBooking ? '&codeBooking=' + param.codeBooking : '') +
            (param.type ? '&type=' + param.type : '&type=' + - 1) +
            (param.fromDate ? '&fromDate=' + param.fromDate : '') +
            (param.toDate ? '&toDate=' + param.toDate : '') 
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.booking.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    approved(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.booking.approved + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.booking.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    arrival(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.booking.arrival + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    checkin(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.booking.checkin + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    checkTransfer(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.booking.checkTransfer + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.booking.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    
    }
}   