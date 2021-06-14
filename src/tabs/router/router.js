import Hello from './hello/hello.js';

const routes = [
  {path: '/hello', component: Hello}
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount('#content-container');