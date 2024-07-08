import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';




export async function get_account_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api_admin.post('/account/get_account_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_account_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}
export async function get_staff_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api_admin.post('/account/get_staff_list', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {
        console.log("get_staff_list" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function account_update(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api_admin.post('/account/update', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("account_update" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function get_staff_role_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const response = await api_admin.post('/account/get_staff_role_list', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("get_staff_role_list" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function register(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const response = await api.post('/register', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("register" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}
export async function account_set_deactivate(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;

    try {
        const response = await api_admin.post('/account/set_deactivate', request_body, { signal });

        return response_with_mess(true, mess_title, response.data.success, response.data);

    } catch (error) {

        console.log("account_set_deactivate" + " BIG ERROR", error)

        return response_with_mess(false, mess_title, error.response.data.error, null);

    }
}

export async function get_payment_history(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/account/get_payment_history', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_payment_history" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_account_detail(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/account/get_account_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_account_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}
export async function get_update_account_detail(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await axios.post(`${backend_url}/get_update_account_detail`, request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_update_account_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}




