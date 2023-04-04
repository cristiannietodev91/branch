export default (to) => {
  if (localStorage.getItem('user') === null && to.fullPath !== '/user/login') {
    // verify with firebase or jwt
    localStorage.removeItem('user')
    return '/user/login';
  }
}
