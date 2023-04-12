import axios from "axios";
const baseUrl = '//localhost:3001/users';

let headersList = {
 "Accept": "*/*",
}

export const getAllUsers = async () => {
    const response = await axios.get(baseUrl, {
        headers: headersList
    });
    
    return response;
}
