const axios = require('axios')

const baseUrl = 'http://192.168.20.44:8081'
const requestApi = axios.create({
   baseURL: baseUrl,
})

export const getSomeOfPRD = async (content: string) => {
   return (await (requestApi.get(`/chat/getPrdInfo?content=${content}&fake=true`)))
}

export const getDetailOfPRD = async (content: string, time: number) => {
   return (await (requestApi.get(`/chat/getNextPrdInfo?content=${content}&time=${time}&fake=true`)))
}

export const getHelpOfPRD = async (content: string) => {
   return (await requestApi.get(`/chat/getCodeHelp?content=${content}&fake=true`))
}
