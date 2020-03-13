import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    }, {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    }, {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: {
                title: 'Inicio',
                icon: 'dashboard'
            }
        }]
    }, {
        path: '/tasks',
        component: Layout,
        children: [{
            path: 'index',
            name: 'TasksIndex',
            component: () => import('@/views/tasks/index'),
            meta: {
                title: 'Tareas',
                icon: 'tasks'
            }
        }, {
            path: 'vdf/:taskId',
            name: 'VdfTaskDetails',
            component: () => import('@/views/tasks/components/VdfTaskDetails'),
            props: true,            
            hidden: true
        }]
    }, {
        path: '/subjects',
        component: Layout,
        redirect: '/subjects/index',
        name: 'SubjectsIndex',
        meta: {
            title: 'Personas',
            icon: 'subjects'
        },
        children: [{
            path: 'index',
            name: 'Subjects',
            component: () => import('@/views/subjects/index'),
            meta: {
                title: 'Índice'
            }
        }, {
            path: '/demograp',
            name: 'SubjectsDemograp',
            component: () => import('@/views/subjects/demograp'),            
            meta: {
                title: 'Demografía'
            }
        }, {
            path: '/subject/:subjectId',
            name: 'SubjectDetails',
            component: () => import('@/views/subjects/components/SubjectDetails'),
            props: true,
            
            hidden: true
        }]
    }, {
        path: '/recognition',
        component: Layout,
        children: [{
            path: 'recognition',
            name: 'Recognition',
            component: () =>
                import('@/views/subjects/components/SubjectRecognition'),
            meta: {
                title: 'Análisis',
                icon: 'face-recognition'
            }
        }]
    }, {
        path: '/cameras',
        component: Layout,
        children: [{
            path: 'index',
            name: 'CamerasIndex',
            component: () => import('@/views/cameras/index'),
            meta: {
                title: 'Cámaras',
                icon: 'camera'
            }
        }, {
            path: '/cameras/:cameraId',
            component: () =>
                import('@/views/cameras/components/CameraDetails'),
            props: true,
            name: 'CameraDetails',
            hidden: true
        }]
    }, {
        path: '/map',
        component: Layout,
        children: [{
            path: 'index',
            name: 'Map',
            component: () =>
                import('@/views/cameras/components/CamerasMap'),
            meta: {
                title: 'Mapa',
                icon: 'map'
            }
        }]
    }, {
        path: '/video',
        component: Layout,
        children: [{
            path: 'index',
            name: 'VideosIndex',
            component: () => import('@/views/video/index'),
            meta: {
                title: 'Videos',
                icon: 'video-record'
            }
        }, {
            path: '/video/:videoId',
            component: () =>
                import('@/views/video/components/VideoDetails'),
            props: true,
            name: 'VideoDetails',
            hidden: true
        }]
    }, { // 404 page must be placed at the end !!!
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
