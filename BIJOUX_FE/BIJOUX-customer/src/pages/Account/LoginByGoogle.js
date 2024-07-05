import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, GoogleButton } from '@react-oauth/google';
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
            console.log("User from token", user)


            const formData = new FormData();
            formData.append('token_id', token);
            const response = await login_with_google(formData);
            if (response.success) {

                const user = getUserFromToken(response.token);
                console.log("User From JWTttttt", user)

                setUrl(user.imageUrl)
                const redirectUrl = localStorage.getItem('redirectUrl');
                if (redirectUrl) {
                    localStorage.removeItem('redirectUrl');
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = '/';
                }
                save_login(dispatch, response.token, user)
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
        <div className="flex flex-col items-center">
            <h1 className="font-titleFont text-2xl font-semibold text-gray-600 mb-4">Google Login</h1>
            <div className="w-full max-w-xs">
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        render={renderProps => (
                            <button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className="flex items-center justify-center bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                            >
                                <img src="https://i.pinimg.com/564x/60/41/99/604199df880fb029291ddd7c382e828b.jpg" alt="Google" className="w-6 h-6 mr-2" />
                                Login with Google
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>


    );
}

export default LoginByGoogle;

