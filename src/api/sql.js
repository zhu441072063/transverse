import requestsql from '@/utils/requestsql'

export function getSql(params) {
  params.mode = 'get'
  for (var i in params) {
    if (params[i] === '') {
      params[i] = null
    }
  }
  return requestsql({
    url: '/',
    method: 'get',
    params
  })
}

export function setSql(params) {
  params.mode = 'exec'
  return requestsql({
    url: '/',
    method: 'get',
    params
  })
}
