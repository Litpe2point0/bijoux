import { deactivatedAlertMaker } from "../instance/axiosInstance";



export function response_with_mess(isSuccess, title, mess, data) {
    if(mess === 'isDeactivated') {{
        deactivatedAlertMaker()
    }}
    const response = {
        success: isSuccess,
        mess: {
            color: isSuccess ? "success" : "danger",
            title: title,
            mess: mess,
        },
        data: data
    }
    console.log("RESPONSE HERE",response)
    return response;
}