import axios from 'axios';
import { backend_url } from '../../Back_End_Url'
import { api_admin, api, login_required_api } from '../../instance/axiosInstance';
import { response_with_mess } from '../responseGenerator';



export async function get_order_list_manager(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_order_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_order_list_manager" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_order_detail(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_order_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_order_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function reassign_order(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/reassign_order', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("reassign_order" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function cancel_order(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/cancel', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("cancel_order" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
} 

export async function get_design_process_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_design_process_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_design_process_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_design_process_detail(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_design_process_detail', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_design_process_detail" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function approve_design_process(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/approve_design_process', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("approve_design_process" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_assigned_order_list_sale(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_assigned_orders_sale', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_assigned_order_list_sale" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function pricing_design_process(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/pricing_design_process', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("pricing_design_process" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function get_assigned_orders_design(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_assigned_orders_design', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_assigned_orders_design" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function request_design_process(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/request_design_process', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("request_design_process" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_assigned_orders_production(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_assigned_orders_production', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_assigned_orders_production" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_production_process_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_production_process_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_production_process_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function add_production_process(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/add_production_process', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("add_production_process" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_production_status_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_production_status_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_production_status_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_assigned_complete_orders_production(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/get_assigned_complete_orders_production', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_assigned_complete_orders_production" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function production_complete(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/admin/order/production_complete', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("production_complete" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function create_payment_link(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/create_payment_link', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("create_payment_link" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}


export async function add_order_template(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/add_order_template', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("add_order_template" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function add_quote(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/quote/add_quote', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("add_quote" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_order_list_customer(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_order_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_order_list_customer" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_order_detail_customer(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_order_detail_customer', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_order_detail_customer" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}

export async function get_order_status_list(formData, title, loginRequired, { signal } = {}) {
    const mess_title = title ? title : null;
    const request_body = formData ? formData : null;
    try {
        const apiInstance = loginRequired ? login_required_api : api;
        const response = await apiInstance.post('/order/get_order_status_list', request_body, { signal });
        return response_with_mess(true, mess_title, response.data.success, response.data);
    } catch (error) {
        console.log("get_order_status_list" + " BIG ERROR", error)
        return response_with_mess(false, mess_title, error.response.data.error, null);
    }
}