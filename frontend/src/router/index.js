import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/views/Profile.vue'
import Portfolio from '@/views/Portfolio.vue'
import Tech from '@/views/Tech.vue'
import Experience from '@/views/Experience.vue'
import ExperienceTextEditor from "@/views/ExperienceTextEditor.vue";
import ExperienceDetail from '@/views/ExperienceDetail.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', component: Profile },
        { path: '/portfolio', component: Portfolio },
        { path: '/tech', component: Tech },
        { path: '/experience', component: Experience },
        { path: '/experience/new', component: ExperienceTextEditor },
        { path: '/experience/:expId', component: ExperienceDetail},



    ]
})
