import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getPageTitle } from '@/lib/index';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    // set page title
    document.title = getPageTitle(to.meta.title);

    if (whiteList.indexOf(to.path) !== -1 || store.state.user.isAuthenticated) {
        // in the free login whitelist, go directly
        next();
    } else {
        // other pages that do not have permission to access are redirected to the login page.
        try {
            // get user info
            await store.dispatch('user/checkAuth');
            next();
            NProgress.done();
        } catch (error) {
            next(`/login`);
            NProgress.done();
        }        
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
