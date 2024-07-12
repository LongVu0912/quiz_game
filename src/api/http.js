import axios from "axios";

// Create an Axios instance
const http = axios.create({
    baseURL: "http://localhost:8080/api",
});

export default http;