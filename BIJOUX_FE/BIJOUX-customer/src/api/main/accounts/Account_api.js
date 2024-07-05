import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api, login_required_api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';




export async function get_account_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/account/get_account_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_account_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}
export async function get_staff_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;

        const response = await apiInstance.post('/admin/account/get_staff_list', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {
        console.log("get_staff_list" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function account_update(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;

        const response = await apiInstance.post('/admin/account/update', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("account_update" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function get_staff_role_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const apiInstance = loginRequired ? login_required_api : api;

        const response = await apiInstance.post('/admin/account/get_staff_role_list', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("get_staff_role_list" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function register(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const apiInstance = loginRequired ? login_required_api : api;

        const response = await apiInstance.post('/register', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("register" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function account_set_deactivate(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const apiInstance = loginRequired ? login_required_api : api;

        const response = await apiInstance.post('/admin/account/set_deactivate', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("account_set_deactivate" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}

export async function update_self(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const apiInstance = loginRequired ? login_required_api : api;
        
        const response = await apiInstance.post('/account/update', request_body, { signal });
        
        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("update_self" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}

export async function get_account_detail(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const apiInstance = loginRequired ? login_required_api : api;
        
        const response = await apiInstance.post('/account/get_account_detail', request_body, { signal });
        
        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("get_account_detail" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function get_payment_history(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/account/get_payment_history', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_payment_history" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function activate_account(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/activate_account', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("activate_account" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}




