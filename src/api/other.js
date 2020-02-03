import othersql from '@/utils/othersql'
import pic from '@/utils/uploadpic'

export function login(data) {
  console.log(data.username)
  return othersql({
    url: '/login',
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
}

export function uploadpic(data) {
  return pic({
    url: '/uploadpic',
    method: 'post',
    data: data,
  })
}
