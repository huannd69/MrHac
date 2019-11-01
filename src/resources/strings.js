// let wallet_services = '/wallet-services-dev'; //dev
let wallet_services = '/wallet-services-test'; //test 
// let isofhcare_service = '/isofhcare-dev'; //dev 
let isofhcare_service = ''; //test



module.exports = {
    key: {
        storage: {
            current_account: "CURRENT_USER"

        }
    },
    action: {
        action_user_login: "ACTION_USER_LOGIN",
        action_user_logout: "ACTION_USER_LOGOUT",
        action:'action'
    },
    message: {
        user: {
            create_error: "Tạo mới tài khoản không thành công!",
            update_error: "Cập nhật tài khoản không thành công!",
            error_code_2: "SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác!",
            error_code_3: "Email đã được sử dụng trong hệ thống. Vui lòng sử dụng Email khác!",
            error_code_4: "Số văn bằng chuyên môn đã tồn tại trên hệ thống. Vui lòng sử dụng Số văn bằng chuyên môn khác!",
            error_code_5: "Username đã tồn tại trên hệ thống. Vui lòng sử dụng Username khác!",
        }, post: {
            approved_success: "Duyệt câu hỏi và gán cho bác sĩ thành công!",
            approved_error: "Duyệt câu hỏi không thành công!",
        },
        hospital: {
            create_error: "Tạo mới tài khoản không thành công!",
            update_error: "Cập nhật tài khoản không thành công!",

        }
    },
    api: {
        user: {
            search: isofhcare_service + "/user/search",
            login: isofhcare_service + "/api/login",
            block: isofhcare_service + "/user/block",
            create: isofhcare_service + "/user/create",
            update: isofhcare_service + "/user/update",
            active: isofhcare_service + "/user/set-active",
            detail: isofhcare_service + "/user/get-detail",
            updatePassword: isofhcare_service + "/user/update-password",
            getListBySpecialist: isofhcare_service + "/user/getListBySpecialist",
        }, image: {
            upload: isofhcare_service + "/upload/image"
        }, specialist: {
            getAll: isofhcare_service + "/specialist/get-all",
            search: isofhcare_service + "/specialist/search",
            create: isofhcare_service + "/specialist/create",
            delete: isofhcare_service + "/specialist/delete",
            update: isofhcare_service + "/specialist/update",
        }, serviceType: {
            getAll: isofhcare_service + "/service-type/get-all",
            search: isofhcare_service + "/service-type/search",
            create: isofhcare_service + "/service-type/create",
            delete: isofhcare_service + "/service-type/delete",
            update: isofhcare_service + "/service-type/update",
        }, service: {
            search: isofhcare_service + "/service/search",
            type: isofhcare_service + "/service-type/search",
            special: isofhcare_service + "/specialist/get-all",
            create: isofhcare_service + "/service/create",
            update: isofhcare_service + "/service/update",
            delete: isofhcare_service + '/service/delete',
            getAll: isofhcare_service + '/service/get-all'
        }, post: {
            search: isofhcare_service + "/post/search",
            assign: isofhcare_service + "/post/assign",
            approved: isofhcare_service + "/post/approved-post",
            approvedList: isofhcare_service + "/post/assign-list-post",
        }, role: {
            search: isofhcare_service + "/roles/search",
            create: isofhcare_service + "/roles/create",
            delete: isofhcare_service + "/roles/delete",
            block: isofhcare_service + "/roles/block",
            getDetail: isofhcare_service + "/roles/get-detail",
            update: isofhcare_service + "/roles/update",
        }, permission: {
            search: isofhcare_service + "/permission/search",
            create: isofhcare_service + "/permission/create",
            delete: isofhcare_service + "/permission/delete",
            update: isofhcare_service + "/permission/update",
        }, comment: {
            search: isofhcare_service + "/comment/search",
            create: isofhcare_service + "/comment/create",
            delete: isofhcare_service + "/comment/delete",
            update: isofhcare_service + "/comment/update",
            acceptAsSolution: isofhcare_service + "/comment/accept-as-solution",
        }, hospital: {
            getAll: isofhcare_service + "/hospital/get-all",
            create: isofhcare_service + "/hospital/create",
            delete: isofhcare_service + "/hospital/delete",
            getDetail: isofhcare_service + "/hospital/get-detail",
            search: isofhcare_service + "/hospital/search",
            update: isofhcare_service + "/hospital/update",
            active: isofhcare_service + "/hospital/set-active",
            set_ticket:isofhcare_service + '/hospital/manager-reception',
            get_info_ticket:isofhcare_service + '/number-hospital/history'
        },
        wallet: {
            detail: wallet_services + "/partners",
            getDetail: wallet_services + "/online-transactions"
        },
        doctorInf: {
            active: isofhcare_service + "/doctorInf/active",
            create: isofhcare_service + "/doctorInf/create",
            reject: isofhcare_service + "/doctorInf/reject",
            search: isofhcare_service + "/doctorInf/search",
        },
        booking: {
            search: isofhcare_service + "/booking/search",
            approved: isofhcare_service + "/booking/approved-booking",
            update: isofhcare_service + "/booking/update",
            arrival: isofhcare_service + "/booking/update-arrival",
            checkin: isofhcare_service + "/booking/checkin",
            checkTransfer: isofhcare_service + "/booking/payTranfer",
            getDetail: isofhcare_service + "/booking/get-detail",
        },
        zone: {
            getAll: isofhcare_service + "/zone/get-by-district"
        },
        province: {
            getAll: isofhcare_service + "/province/get-all"
        },
        district: {
            getAll: isofhcare_service + "/district/get-all",
            getProvince: isofhcare_service + "/district/get-by-province"
        },
        medicine_category: {
            getAll: isofhcare_service + "/medicine-category/get-all",
            search: isofhcare_service + "/medicine-category/search",
            create: isofhcare_service + "/medicine-category/create",
            delete: isofhcare_service + "/medicine-category/delete",
            update: isofhcare_service + "/medicine-category/update",
        },
        userTracking: {
            search: isofhcare_service + "/user-tracking/search",
            total: isofhcare_service + "/user/total-user"
        },
        upload: {
            import: isofhcare_service + "/user/import-user",
        },
        advertise: {
            search: isofhcare_service + '/advertise/search',
            create: isofhcare_service + '/advertise/create',
            delete: isofhcare_service + '/advertise/delete'
        },
        voucher: {
            getList: isofhcare_service + '/voucher',
            create: isofhcare_service + '/voucher/create',
            getHistory: isofhcare_service + '/voucher/history',
            importUser: isofhcare_service + '/voucher/create/available',
            generate: isofhcare_service + '/voucher/generate',
        },
        medicalRecord: {
            getListByUser: isofhcare_service + '/medical-records/get-list-medical-records-by-user',
        }
    }
} 