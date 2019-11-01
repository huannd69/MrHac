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
            (param.stringQuyery ? '&stringQuyery=' + param.stringQuyery : '') +
            '&active=' + (param.active == undefined ? -1 : param.active ? param.active : 0) +
            (param.type ? '&type=' + param.type : '&type=' + - 1)
            + (param.availableBooking ? '&availableBooking=' + param.availableBooking : '&availableBooking=' + -1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.hospital.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.hospital.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    active(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.hospital.active + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.hospital.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    setTicket(id, hourBegin, hourEnd, dailyCombin, expired, numTurn) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi('put', constants.api.hospital.set_ticket + `/${id}?hourBegin=${hourBegin}&hourEnd=${hourEnd}&dailyCombin=${dailyCombin}&expired=${expired}&numTurn=${numTurn}`).then(x => {
                resolve(x)
            }).catch(e => {
                reject(e)
            })
        })
    },
    getTicketInfo(startDate, endDate, hospitalId) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi('get', constants.api.hospital.get_info_ticket + `?startDate=${startDate}&endDate=${endDate}&hospitalId=${hospitalId}`).then(x => {
                resolve(x)
            }).catch(e => {
                reject(e)
            })
        })
    },
    searchWithOutPageSize() {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.search + '?page=1&size=100&serviceTypeId=-1&active=-1&type=-1&availableBooking=-1', {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },

}