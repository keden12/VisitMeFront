import Api from '@/services/api'

export default {
  fetchListings () {
    return Api().get('/listings')
  },
  postListings (listing) {
    return Api().post('/listings', listing,
      { headers: {'Content-type': 'application/json'} })
  },

  loveListing (id) {
    return Api().put(`/listings/${id}/love`)
  },

  deleteListing (id) {
    return Api().delete(`/listings/${id}`)
  },

  getListingByTitle (title) {
    return Api().get(`/listings/title/${title}`)
  }
}
