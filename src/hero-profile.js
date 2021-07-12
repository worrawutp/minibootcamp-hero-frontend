document.addEventListener('DOMContentLoaded', function() {
  let queryParams = new URLSearchParams(window.location.search)
  let id = queryParams.get('id')
  if(id === null) { return }

  let heroProfile = document.getElementById('hero-profile')
  if(heroProfile == null) { return }

  let url = process.env.API_URL + "/heroes/" + id
  fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(resp =>  {
    if(!resp.ok){
      return Promise.reject('error 404')
    } else {
      return resp.json()
    }
  })
  .then(data => {
    console.log(data)
    // Update HTML DOM at #hero-profile
    heroProfile.insertAdjacentHTML('afterend', `
      <div class="profile">
        <h4>${data.name}</h4>
        <div>${data.hp}</div>
      </div>
    `)
  })
})
