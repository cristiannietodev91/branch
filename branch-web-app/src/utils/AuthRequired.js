import { isDemo } from '../constants/config'
export default (to, from, next) => {

  if (isDemo)
    next()
  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
    // verify with firebase or jwt
    next()
  } else {
    localStorage.removeItem('user')
    next('/user/login')
  }
}
