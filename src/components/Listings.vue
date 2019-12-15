<template>
  <div class="hero">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messagetitle}}</h3>

    <div id="app1">
      <b-form-input type="text" v-model="search" class="searching" placeholder="Search Listing"></b-form-input>
      <b-card-group deck>
      <div v-for="listing of filteredListings">
        <b-card
        :title="listing.title"
        :img-src="listing.featuredimage"
        :img-alt="listing.title"
        img-top
        img-height="200px"
        tag="article"
        style="max-width: 20rem;"
        class="mb-2 cardstyle"
      >
        <i>
        <h6 style="color:gray;">
          {{listing.category}}
        </h6></i>
        <b-card-text style="overflow:auto; height:150px;">
          {{listing.description}}
        </b-card-text>

          <i><b>
          <b-card-text>
            {{listing.location}}
          </b-card-text>
          </b>
          </i>
        <hr>
        <template v-if="listing.facebook">
          <a :href="listing.facebook"><i class="fa fa-facebook fa-2x" style="padding-right: 5px"></i></a>
        </template>
        <template v-if="listing.instagram">
          <a :href="listing.instagram"><i class="fa fa-instagram fa-2x" style="padding: 5px"></i></a>
        </template>
        <template v-if="listing.twitter">
          <a :href="listing.twitter"><i class="fa fa-twitter fa-2x" style="padding: 5px"></i></a>
        </template>
        <hr>
        <i :id="listing._id" class="fa fa-heart fa-2x float-lg-left" style="padding: 3px" @click="love(listing._id)"> {{listing.hearts}}</i>
        <i class="fa fa-trash-o fa-2x float-lg-right" style="padding: 3px" @click="deleteListing(listing._id)"></i>
      </b-card>
      </div>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import ListingService from '@/services/ListingService'
import Vue from 'vue'
import VueTables from 'vue-tables-2'
import VueSweetalert2 from 'vue-sweetalert2'

import 'sweetalert2/dist/sweetalert2.min.css'

Vue.use(VueSweetalert2)
// Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

export default {
  name: 'Listings',
  data () {
    return {
      messagetitle: ' Listings ',
      props: ['_id'],
      listings: [],
      errors: [],
      search: '',
      columns: ['_id', 'title', 'category', 'hearts'],
      options: {
        headings: {
          _id: 'ID',
          title: 'Title',
          category: 'Category',
          hearts: 'Hearts'
        }
      }
    }
  },

  created () {
    this.loadListings()
  },
  computed: {
    filteredListings: function () {
      return this.listings.filter((listing) => {
        return listing.description.toUpperCase().match(this.search.toUpperCase())
      })
    }
  },
  methods: {
    love: function (id) {
      ListingService.loveListing(id)
        .then(response => {
          var element = document.getElementById(id)
          var text = element.innerText
          var parsed = parseInt(text)
          parsed = parsed + 1
          console.log(parsed)
          document.getElementById(id).innerText = ' ' + parsed

          console.log(response)
        })
        .catch(error => {
          this.errors.push(error)
          console.log(error)
        })
    },
    deleteListing: function (id) {
      this.$swal({
        title: 'Are you totaly sure?',
        text: 'You can\'t Undo this action',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK Delete it',
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        showLoaderOnConfirm: true
      }).then((result) => {
        console.log('SWAL Result : ' + result)
        if (result === true) {
          ListingService.deleteListing(id)
            .then(response => {
              // JSON responses are automatically parsed.
              this.message = response.data
              console.log(this.message)
              this.loadListings()
              // Vue.nextTick(() => this.$refs.vuetable.refresh())
              this.$swal('Deleted', 'You successfully deleted this Listing ' + JSON.stringify(response.data, null, 5), 'success')
            })
            .catch(error => {
              this.$swal('ERROR', 'Something went wrong trying to Delete ' + error, 'error')
              this.errors.push(error)
              console.log(error)
            })
        } else {
          this.$swal('Cancelled', 'Your Listing is still there!', 'info')
        }
      })
    },
    loadListings: function () {
      ListingService.fetchListings()
        .then(response => {
          // JSON responses are automatically parsed.
          this.listings = response.data
          console.log(this.listings)
        })
        .catch(error => {
          this.errors.push(error)
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  #app1 {
    width: 60%;
    margin: 0 auto;
  }

  .searching{
    margin-top: 4%;
    margin-bottom: 4%;

  }
  .vue-title {
    margin-top: 30px;
    text-align: center;
    font-size: 45pt;
    margin-bottom: 10px;
  }
</style>
