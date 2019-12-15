import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Listings from '@/components/Listings'
import AddListing from '@/components/AddListing'
import Map from '@/components/Map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/listings',
      name: 'Listings',
      component: Listings
    },
    {
      path: '/add',
      name: 'Add Listing',
      component: AddListing
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    }
  ]
})
