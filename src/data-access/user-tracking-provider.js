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
            (param.name ? '&name=' + param.name : '') +
            (param.phone ? '&phone=' + param.phone : '') +
            (param.fromDate ? '&fromDate=' + param.fromDate : '') +
            (param.toDate ? '&toDate=' + param.toDate : '') +
            (param.style ? '&style=' + param.style : '') +
            (param.style ? '&type=' + param.userType : '') +
            (param.userStatus ? '&status=' + param.userStatus+'&totalAction=3' : '') +
            (param.deviceType ? '&deviceType=' + param.deviceType : '') +
            (param.sourceImportFileName ? '&sourceImportFileName=' + param.sourceImportFileName: '')
            
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.userTracking.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    totalUser(param) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.userTracking.total, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    }
}