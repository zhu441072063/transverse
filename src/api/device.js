// import request from '@/utils/request'
import requestsql from '@/utils/requestsql'

export function fetchList(params) {
  return requestsql({
    url: '/',
    method: 'get',
    params
  })
}
export function createDevice(params) {
  return requestsql({
    url: '/',
    method: 'post',
    params
  })
}
export function updateDevice(params) {
  return requestsql({
    url: '/',
    method: 'post',
    params
  })
}
