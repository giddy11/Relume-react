import axios from 'axios';
// import jwt_decode from 'jwt-decode'; // Correct import for jwt-decode
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Correct named import

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Requests **/

/** To get username from Token */
export async function getUsername() {
    const token = localStorage.getItem('token');
    console.log(`this is the token: ${token}`)
    if (!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token);
    console.log(`this is the decode: ${decode}`)
    return decode;
}

/** Authenticate function */
export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', { username });
    } catch (error) {
        return { error: "Username doesn't exist...!" };
    }
}

/** Get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password doesn't Match...!" };
    }
}

/** Register user function */
export async function registerUser(credentials) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /** Send email */
        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** Login function */
// export async function verifyPassword({ username, password }) {
//     try {
//         if (username) {
//             const { data } = await axios.post('/api/login', { username, password });
//             return Promise.resolve({ data });
//         }
//     } catch (error) {
//         return Promise.reject({ error: "Password doesn't Match...!" });
//     }
// }

/** login function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject(error.response ? error.response.data : { error: "Unknown error" });
    }
}

/** Update user profile function */
export async function updateUser(response) {
    try {
        const token = localStorage.getItem('token');
        const { data } = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });

        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
}

/** Generate OTP */
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // Send mail with the OTP
        if (status === 201) {
            const { data: { email } } = await getUser({ username });
            const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" });
            return Promise.resolve(code);
        } else {
            throw new Error('Failed to generate OTP');
        }
    } catch (error) {
        console.error('Error in generateOTP:', error);
        return Promise.reject(error.response ? error.response.data : { error: 'Unknown error' });
    }
}

/** Verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject(error);
    }
}

/** Reset password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}
