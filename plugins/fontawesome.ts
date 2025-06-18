// plugins/fontawesome.js
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUserCircle, 
  faGraduationCap, 
  faBook, 
  faChartBar, 
  faSignOutAlt,
  faUser,
  faSpinner,
  faExclamationCircle,
  faUserPlus,
  faQuestionCircle,
  faSignInAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

// 防止自动添加CSS
config.autoAddCss = false

// 添加图标到库
library.add(
  faUserCircle, 
  faGraduationCap, 
  faBook, 
  faChartBar, 
  faSignOutAlt,
  faUser,
  faSpinner,
  faExclamationCircle,
  faUserPlus,
  faQuestionCircle,
  faSignInAlt,
  faChevronDown
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})