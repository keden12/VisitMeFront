<template>
  <div id="app1" class="hero">
  <h3 class="vue-title"><i class="fa fa-plus" style="padding: 3px"></i>{{messagetitle}}</h3>
  <div class="container mt-3 mt-sm-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

  <form @submit.prevent="submit">
    <div class="form-group">
      <label class="form-label">Title</label>
      <input class="form__input" type="text" v-model="title"/>
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <b-form-textarea
        id="textarea"
        v-model="description"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Website</label>
      <input class="form__input" type="text" v-model="website"/>
    </div>
    <div class="form-group">
      <label class="form-label">Featured Image</label>
      <b-form-file
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @change="onFileSelected"
      ></b-form-file>
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <input class="form__input" type="text" v-model="category"/>
    </div>
    <div class="form-group">
      <label class="form-label">Location</label>
      <input class="form__input" type="text" v-model="location"/>
    </div>
    <div class="form-group">
      <label class="form-label">Mobile</label>
      <input class="form__input" type="text" v-model="mobile"/>
    </div>
    <div class="form-group">
    <label class="form-label">Facebook</label>
    <input class="form__input" type="text" v-model="facebook"/>
  </div>
    <div class="form-group">
      <label class="form-label">Instagram</label>
      <input class="form__input" type="text" v-model="instagram"/>
    </div>
    <div class="form-group">
      <label class="form-label">Twitter</label>
      <input class="form__input" type="text" v-model="twitter"/>
    </div>
    <p>
      <button class="btn btn-primary btn1" type="submit" :disabled="submitStatus === 'PENDING'">Add Listing</button>
    </p>
    <p class="typo__p" v-if="submitStatus === 'OK'">Thanks for your Listing!</p>
    <p class="typo__p" v-if="submitStatus === 'ERROR'">Please Fill in the Form Correctly.</p>
    <p class="typo__p" v-if="submitStatus === 'PENDING'">Listing...</p>
  </form>
      </div><!-- /col -->
    </div><!-- /row -->
  </div><!-- /container -->
  </div>
</template>

<script>
import Vue from 'vue'
import VueForm from 'vueform'
import Vuelidate from 'vuelidate'
import VueSweetalert from 'vue-sweetalert'
import ListingService from '@/services/ListingService'
import { required, minLength, between } from 'vuelidate/lib/validators'
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyBfKjwV5SwD7-7NtYh3IMTgItAz9EAJ03Y',
  authDomain: 'visitme-a8aba.firebaseapp.com',
  databaseURL: 'https://visitme-a8aba.firebaseio.com',
  projectId: 'visitme-a8aba',
  storageBucket: 'visitme-a8aba.appspot.com',
  messagingSenderId: '485809478938',
  appId: '1:485809478938:web:51ca1c071e01b9cac120a3',
  measurementId: 'G-1PV1SXBGNJ'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const ref = firebase.storage().ref()

Vue.use(VueForm, {
  inputClasses: {
    valid: 'form-control-success',
    invalid: 'form-control-danger'
  }
})

Vue.use(Vuelidate)
Vue.use(VueSweetalert)

export default {
  name: 'Donate',
  data () {
    return {
      messagetitle: ' Add Listing ',
      message: '',
      title: '',
      description: '',
      website: '',
      selectedFile: null,
      featuredimage: '',
      category: '',
      location: '',
      mobile: '',
      facebook: '',
      twitter: '',
      instagram: '',
      listing: {},
      submitStatus: null
    }
  },
  validations: {
    title: {
      required
    },
    description: {
      required
    },
    category: {
      required
    },
    location: {
      required
    }

  },
  methods: {

    submit () {
      console.log('submit!')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.submitStatus = 'PENDING'
        setTimeout(() => {
          this.submitStatus = 'OK'
          var image = ''
          const name = (+new Date()) + '-' + this.selectedFile.name
          const metadata = { contentType: this.selectedFile.type }
          const task = ref.child(name).put(this.selectedFile, metadata)
          task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
              this.featuredimage = url
              var listing = {
                title: this.title,
                description: this.description,
                website: this.website,
                featuredimage: this.featuredimage,
                category: this.category,
                location: this.location,
                mobile: this.mobile,
                facebook: this.facebook,
                instagram: this.instagram,
                twitter: this.twitter
              }
              this.listing = listing
              console.log('Submitting in DonationForm : ' + JSON.stringify(this.listing, null, 5))
              this.submitDonation(this.listing)
            })
        }, 500)
      }
    },
    submitDonation: function (listing) {
      console.log('submitListing!')
      console.log('Submitting in submitDonation : ' + listing)
        ListingService.postListings(listing)
        .then(response => {
          // JSON responses are automatically parsed.
          console.log(response)
        })
        .catch(error => {
          this.errors.push(error)
          console.log(error)
        })
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
    }
  }
}
</script>

<style scoped>
  .vue-title {
    margin-top: 30px;
    text-align: center;
    font-size: 45pt;
    margin-bottom: 10px;
  }
  #app1 {
    width: 95%;
    margin: 0 auto;
  }
  .required-field > label::after {
    content: '*';
    color: red;
    margin-left: 0.25rem;
  }
  .donate-form .form-control-label.text-left{
    text-align: left;
  }

  label {
    display: inline-block;
    width: 540px;
    text-align: left;
    font-size: x-large;
  }
  .typo__p {
    width: 540px;
    font-size: x-large;
  }
  .btn1 {
    width: 300px;
    font-size: x-large;
  }
  p {
    margin-top: 20px;
  }

  input {
    border: 1px solid silver;
    border-radius: 4px;
    background: white;
    padding: 5px 10px;
    width: 540px;
  }

  .dirty {
    border-color: #5A5;
    background: #EFE;
  }

  .dirty:focus {
    outline-color: #8E8;
  }

  .error {
    border-color: red;
    background: #157ffb;
    color: whitesmoke;
  }

  .error:focus {
    outline-color: #ffa519;
  }
</style>
