import axios, { AxiosResponse } from 'axios'

const NewsServices = {

    getAll(body: any): Promise<AxiosResponse<any, any>> {
        return axios.get(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=efe5aec6610f42869424477b4788c4d2`)
    },
}

export default NewsServices