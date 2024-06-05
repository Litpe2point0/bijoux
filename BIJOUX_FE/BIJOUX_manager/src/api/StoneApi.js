
import axios from 'axios';
import {backend_url} from './Back_End_Url'

export async function  get_stoneShape_list(){
    try {
        const response= await axios.post(`${backend_url}/get_stoneShape_list`);
        return response.data;    
    } catch (error) {
        alert(error)
        console.error('Error calculating sum:', error);
    }
    

}

export async function add_stoneShape_list(formData) {
    try {
        const response = await axios.post(
            `${backend_url}/add_stoneShape_list`,
            formData
        );
        
        return { success: response.data.success, new_shape_id: response.data.new_shape_id };
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}

export async function update_stoneShape_list(formData) {
    try {
        const response = await axios.post(
            `${backend_url}/update_stoneShape_list`,
            formData
        );
        
        return { success: response.data.success};
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}
export async function delete_stoneShape_list(formData) {
    try {
        const response = await axios.post(
            `${backend_url}/delete_stoneShape_list`,
            formData
        );
        
        return { success: response.data.success};
    } catch (error) {
        console.error('Error updating product list:', error);
        return { error: error.message };
    }
}