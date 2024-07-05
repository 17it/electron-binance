import SvgIcon from '@/components/SvgIcon' // svg component
import Vue from 'vue'

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const reqWithColors = require.context('./svg-colors', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
requireAll(reqWithColors)
