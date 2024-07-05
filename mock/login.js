
module.exports = [
  // user userinfo
  {
    url: '/mock/userinfo',
    type: 'get',
    response: config => {
      return {
        data: {
          fullname: 'mockFullname',
          username: 'mockUserName',
          email: 'mockEmail',
          avatar: 'https://notion-avatar.vercel.app/api/img/eyJmYWNlIjo3LCJub3NlIjo3LCJtb3V0aCI6OCwiZXllcyI6MCwiZXllYnJvd3MiOjAsImdsYXNzZXMiOjEsImhhaXIiOjUsImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiJyZ2JhKDI1NSwgMCwgMCwgMCkiLCJzaGFwZSI6Im5vbmUifQ==',
          userId: '001'
        }
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
