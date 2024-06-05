
import axios from 'axios';
import { backend_url } from '../Back_End_Url'
import { jwtDecode } from "jwt-decode";

export async function login(formData) {
  try {
    const response = await axios.post(`${backend_url}/login`, formData);
    return response.data;
  } catch (error) {

    return error;
  }

}
export const getUserFromToken = (token) => {
  try {
    //console.log("Token", token)
    const user = jwtDecode(token);
    //console.log("User", user)
    return user;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};





