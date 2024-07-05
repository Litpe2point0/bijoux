import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, GoogleButton } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { getUserFromToken, login_with_google } from '../../api/main/accounts/Login';
import { useDispatch } from 'react-redux';
import { save_login } from './Login';
import { Box, CircularProgress } from '@mui/material';
import { instantAlertMaker } from '../../api/instance/axiosInstance';

export const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function LoginByGoogle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLoginSuccess = async (response) => {
        setLoading(true);
        //console.log('Login Successsss:', response);

        const { credential } = response;
        const token = credential;

        
            const user = jwtDecode(token);
            //console.log("User from tokennnnn", user)


            const formData = new FormData();
            formData.append('token_id', token);
            const login_result = await login_with_google(formData);
            
            console.log("Response from login with google", login_result)
            if (login_result.success) {

                const user = getUserFromToken(login_result.token);
                console.log("User From JWTttttt", user)

                setUrl(user.imageUrl)
                const redirectUrl = localStorage.getItem('redirectUrl');
                if (redirectUrl) {
                    localStorage.removeItem('redirectUrl');
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = '/';
                }
                save_login(dispatch, login_result.token, user)
            } else if (login_result.error) {
                instantAlertMaker('error', 'Login failed', login_result.error);
                console.log(login_result.error)
            }
        
        setLoading(false)
    };

    const handleLoginFailure = (response) => {
        console.error('Login Failed:', response);
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-titleFont text-2xl font-semibold text-gray-600 mb-4">Google Login</h1>
            <div className="w-full max-w-xs">
                <div className="flex justify-center">
                    {loading ?
                        <button
                            disabled
                            className="flex items-center justify-center bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                        >
                            <img src="https://i.pinimg.com/564x/60/41/99/604199df880fb029291ddd7c382e828b.jpg" alt="Google" className="w-6 h-6 mr-2" />
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} >
                                <CircularProgress color="inherit" size={20} /> 
                            </Box>
                        </button>

                        :

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
                    }
                </div>
            </div>
        </div>


    );
}

export default LoginByGoogle;

