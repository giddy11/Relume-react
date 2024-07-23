import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }));

                let endpoint;
                if (!query) {
                    const { username } = await getUsername();
                    console.log(`this is the username in fetchHook: ${username}`);
                    endpoint = `/api/user/${username}`;
                } else {
                    endpoint = `/api/${query}`;
                }

                const { data, status } = await axios.get(endpoint);

                if (status === 200 || status === 201) {
                    setData(prev => ({ ...prev, isLoading: false, apiData: data, status: status }));
                } else {
                    setData(prev => ({ ...prev, isLoading: false, serverError: `Unexpected status code: ${status}` }));
                }
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error.message }));
            }
        };

        fetchData();
    }, [query]);

    return [getData, setData];
}
