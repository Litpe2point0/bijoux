import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { getUserFromToken, login_with_google } from '../../api/main/accounts/Login';
import { useDispatch } from 'react-redux';
import { save_login } from './Login';

export const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function LoginByGoogle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const handleLoginSuccess = async (response) => {
        console.log('Login Successsss:', response);

        const { credential } = response;
        const token = credential;

        try {
            const user = jwtDecode(token);
            console.log("User from token",user)


            const formData = new FormData();
            formData.append('token_id', token);
            const response = await login_with_google(formData);
            if (response.success) {
                
                const user = getUserFromToken(response.token);
                console.log("User From JWTttttt", user)
                
                setUrl(user.imageUrl)
                const redirectUrl = localStorage.getItem('redirectUrl');
                if(redirectUrl){
                    localStorage.removeItem('redirectUrl');
                    window.location.href=redirectUrl;
                }else{
                    window.location.href='/';
                }
                save_login( dispatch,response.token, user)
            } else if (response.error) {
                
                console.log(response.error)
            }
        } catch (error) {
            console.error('Invalid token', error);

        }
    };

    const handleLoginFailure = (response) => {
        console.error('Login Failed:', response);
    };

    return (
        <>
            <div >
                <h1>Google Login</h1>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                />
            </div>
            {/* <img src={url} alt="google login" /> */}
        </>


    );
}

export default LoginByGoogle;

