import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api, login_required_api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';



export async function get_quote_list_manager(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/get_quote_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_quote_list_manager" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}
export async function assign_quote(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/assign_quote', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("assign_quote" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function approve_quote(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/approve_quote', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("approve_quote" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function cancel_quote(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/quote/cancel', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("cancel_quote" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_priced_quote_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/get_priced_quote_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_priced_quote_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_quote_detail(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/quote/get_quote_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_quote_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_assigned_quote_sale(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/get_assigned_quote_sale', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_assigned_quote_sale" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function pricing_quote(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/quote/pricing_quote', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("pricing_quote" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_quote_list_customer(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/quote/get_quote_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_quote_list_customer" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}