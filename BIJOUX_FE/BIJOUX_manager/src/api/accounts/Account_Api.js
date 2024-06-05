import axios from 'axios';
import {backend_url} from './../Back_End_Url'
import {api_admin, api} from './../instance/axiosInstance';


export async function get_role_list(){
    
    try {
        const response_add = await api.get(
           'admin/account/get_staff_role_list'
           
        );
        
        return response_add.data;
    } catch (error) {
        alert("lỗi nè"+error)
        console.error('Error calculating sum:', error);
    }
    return 0;
}

export async function get_account_list(){
    
    try {
        const response = await api_admin.post(
           '/account/get_account_list'
           
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        alert("lỗi nè"+error)
        console.error('Error calculating sum:', error);
    }
    return 0;
}
