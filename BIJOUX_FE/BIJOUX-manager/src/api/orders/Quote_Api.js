import { api } from "../instance/axiosInstance";

export async function get_quote_list(){
    
    try {
        const response = await api.post(
           '/quotes/get_list'
           
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        alert("lỗi nè"+error)
        console.error('Request error:', error);
    }
    return 0;
}