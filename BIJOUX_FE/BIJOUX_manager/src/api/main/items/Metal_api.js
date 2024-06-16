import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';



export async function get_metal_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/metal/get_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_metal_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_metal_detail(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/metal/get_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_metal_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function update_price_metal(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/metal/update_price', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("update_price_metal" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function set_deactivate_metal(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/metal/set_deactivate', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("set_deactivate_metal" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_weight_price(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/metal/get_weight_price', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_weight_price" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}