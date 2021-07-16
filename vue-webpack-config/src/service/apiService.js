import axios from 'axios'

const host = window.vueApi.httpApi

const service = {
    getInterfaceList(projectId) {
        return axios.get(`${host}testcase/interfaceList?projectId=${projectId}`)
    },
    getProjectEnvList(projectId) {
        return axios.get(`${host}testcase/projectEnv?projectId=${projectId}`)
    },
    getProjectList() {
        return axios.get(`${host}testcase/projectList`)
    },
    getTestcaseList(data) {
        return axios.post(`${host}testcase/testcaseList`, data)
    },
    addTestcase(data) {
        return axios.post(`${host}testcase/addTestcase`, data)
    },
    runNow(data) {
        return axios.post(`${host}testcase/runNow`, data)
    },
    deleteById(id) {
        return axios.get(`${host}testcase/deleteById?id=${id}`)
    },
    editData(data) {
        return axios.post(`${host}testcase/editTestcase`, data)
    }
}
export const getProjectList = service.getProjectList
export const getInterfaceList = service.getInterfaceList
export const getProjectEnvList = service.getProjectEnvList
export const getTestcaseList = service.getTestcaseList
export const addTestcase = service.addTestcase
export const runNow = service.runNow
export const deleteById = service.deleteById
export const editData = service.editData


export default {
    getProjectEnvList,
    getInterfaceList,
    getProjectList,
    addTestcase,
    runNow,
    deleteById,
    editData,
    getTestcaseList
}