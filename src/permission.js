import router from './router'
import { getToken } from '@/utils/auth'


router.beforeEach((to, from, next) => {
    // if (getToken() ) {
    //     if (to.path === '/login') {
    //         next('/')
    //     } else {
    //         next()
    //     }
    // } else {
    //     if (to.path == '/login') { next() } else { next('/login') }
    // }
    next()
})

router.afterEach(() => {
    window.scrollTo()
})
