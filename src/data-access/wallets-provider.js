import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    wallet(walletId) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApiVi("get", constants.api.wallet.detail + "/" + walletId + "/wallets", {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },

    transactions(walletId, param) {
        let parameters =
            '?' + (param.tran_id ? 'tran_id=' +  param.tran_id + '&': '') +
            (param.from_date ? 'from_date=' + param.from_date + '&' : '') +
            (param.to_date ? 'to_date=' + param.to_date + '&' : '') +
            (param.type ? 'type=' + param.type + '&' : '') +
            (param.statuses ? 'statuses=' + param.statuses + '&' : '') +
            (param.order_by ? 'order_by=' + param.order_by + '&' : '') +
            (param.order_field ? 'order_field=' + param.order_field + '&' : '') +
            (param.offset ? 'offset=' + param.offset + '&' : '') +
            (param.limit ? 'limit=' + param.limit  : '') 
            

        return new Promise((resolve, reject) => {
            clientUtils.requestApiVi("get", constants.api.wallet.detail + "/" + walletId + "/transactions" + parameters).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },

    getDetail(param) {
        let parameters =
            '?' + (param.tran_id ? 'tran_id=' + param.tran_id + '&' : '') +
            (param.from_date ? 'from_date=' + param.from_date + '&' : '') +
            (param.to_date ? 'to_date=' + param.to_date + '&' : '') +
            (param.type ? 'type=' + param.type + '&' : '') +
            (param.statuses ? 'statuses=' + param.statuses + '&' : '') +
            (param.order_by ? 'order_by=' + param.order_by + '&' : '') +
            (param.order_field ? 'order_field=' + param.order_field + '&' : '') +
            (param.offset ? 'offset=' + param.offset + '&' : '') +
            (param.limit ? 'limit=' + param.limit : '') 
        
        return new Promise((resolve, reject) => {
            clientUtils.requestApiVi("get", constants.api.wallet.getDetail +parameters).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    }
}