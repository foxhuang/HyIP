import { defineConfig } from '@umijs/max';  
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {}, 
  locale: {
    default: 'zh-TW',
    baseSeparator: '-',
  },
  routes: [
    {
      path: '/',
      redirect: '/hyip',
      layout: true, 
    }, 
    {
      name: ' HyIP  ',
      path: '/hyip',
      component: './HyIP',
      layout: true, 
    },  
    {
      name: ' HyIP List  ',
      path: '/hyip/iplist',
      component: './HyIP/iplist',
      layout: true, 
    },  
    {
      name: ' HyIP Lock List  ',
      path: '/hyip/iplocklist',
      component: './HyIP/iplocklist',
      layout: true, 
    },  
    {
      name: ' HyIP  IP Logs  ',
      path: '/hyip/iplogs',
      component: './HyIP/iplogs',
      layout: true, 
    },  
    {
      name: ' HyIP  IP Lock Logs  ',
      path: '/hyip/iplocklogs',
      component: './HyIP/iplocklogs',
      layout: true, 
    }
  ],
  npmClient: 'npm',
  base:'/hyip/',
  publicPath:'/hyip/',
});

