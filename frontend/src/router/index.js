import Vue from 'vue'
import Router from 'vue-router'
import Profile from '../views/Profile.vue'
import Portfolio from '../views/Portfolio.vue'
import Tech from '../views/Tech.vue'
import Experience from '../views/Experience.vue'
import Profile_Admin from "@/views/Profile_Admin.vue";
import ExperienceTextEditor from "@/views/ExperienceTextEditor.vue";
import ExperienceDetail from '@/views/ExperienceDetail.vue'  // ① 추가

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', component: Profile },
        { path: '/portfolio', component: Portfolio },
        { path: '/tech', component: Tech },
        { path: '/experience', component: Experience },
        { path: '/admin/portfoilo', component: Profile_Admin },
        { path: '/experience/text-editor', component: ExperienceTextEditor },
        {path: '/experience/:id', component: ExperienceDetail},



    ]
})
