
import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';



export async function get_shape_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_shape_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_shape_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_diamond_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_diamond_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_diamond_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_diamond_detail(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_diamond_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_diamond_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_color_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_color_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_color_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_origin_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_diamond_origin_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_diamond_origin_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_clarity_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_clarity_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_clarity_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_cut_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_cut_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_cut_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_size_list(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/get_size_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_size_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function update_price_diamond(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/update_price', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("update_price_diamond" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function set_deactivate_diamond(formData, title, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const response = await api.post('/items/diamond/set_deactivate', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("set_deactivate_diamond" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}
