import axios from 'axios';
import {backend_url} from './Back_End_Url'
import {api} from './instance/axiosInstance';


export async function get_product_list(){
    
    try {
        const response_add = await api.post(
           '/get_product_list'
           
        );
        
        return response_add.data;
    } catch (error) {
        alert("lỗi nè"+error)
        console.error('Error calculating sum:', error);
    }
    return 0;
}


export async function add_product_list(formData) {
    try {
        const response = await api.post(
            `/add_product_list`,
            formData
        );
        
        return { success: response.data.success, new_product_id: response.data.new_product_id };
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}
export async function update_product_list(formData) {
    try {
        const response = await api.post(
            `/update_product_list`,
            formData
        );
        
        return { success: response.data.success };
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}
export async function delete_product_list(remove_product) {
    try {
        const response = await api.post(
            `/delete_product_list`,
            { remove_product }
        );
        
        return { success: response.data.success };
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}

export async function add (numberList) {
    try {
        const response_add = await api.post(
            'http://127.0.0.1:8000/add_multiple',
            { numberList }, // Đặt numberList vào body của yêu cầu
            config // Đối tượng cấu hình yêu cầu
        );
        return response_add.data.result;
    } catch (error) {
        alert(error)
        console.error('Error calculating sum:', error);
    }
    return 0;
}