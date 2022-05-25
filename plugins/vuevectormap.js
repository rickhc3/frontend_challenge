// plugins/vuevectormap.js
import Vue from 'vue'
import VueVectorMap from 'vuevectormap'
import '~/assets/css/jsvectormap.css'

// Import your preffered map.
require('jsvectormap/dist/maps/world')

Vue.use(VueVectorMap)