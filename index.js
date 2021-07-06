require('dotenv').config()
import './src/main.scss'

document.addEventListener('DOMContentLoaded', function() {
  let listHeroesDom = document.getElementById('list-heroes')
  if(listHeroesDom == null) { return }

  let url = process.env.API_URL + "/heroes"
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(resp => resp.json())
    .then(data => {
      buildHeroDom(listHeroesDom, data)
      addHeaderTitleToHeroesList(listHeroesDom)
  })
})

function addHeaderTitleToHeroesList(targetDom) {
  targetDom.insertAdjacentHTML('afterbegin', `
    <div class="hero-header">
      <div>Name</div>
      <div>Job</div>
      <div>HP</div>
    </di>
  `)
}

function buildHeroDom(targetDom, data) {
  data.forEach(hero => {
    let htmlStr = `
      <div class="hero">
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.job}</div>
        <div>${hero.hp}<div>
      </div>
    `
    targetDom.insertAdjacentHTML('beforeend', htmlStr) 
  })
}
