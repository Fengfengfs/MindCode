const axios = require('axios')

const baseUrl = 'http://1f0d-61-169-0-18.ngrok-free.app'
const requestApi = axios.create({
   baseURL: baseUrl,
})

export const getSomeOfPRD = async (content: string) => {
   return (await requestApi.get('/chat/getPrdInfo?content=我想要做一个大赛投票记录的需求').data)
}

export const getDetailOfPRD = async (content: string) => {
   return (await requestApi.get(`/chat/getNextPrdInfo?content=${content}`).data)
}

export const getHelpOfPRD = async (content: string) => {
   return (await requestApi.get(`/chat/getCodeHelp?content=${content}`).data)
}
