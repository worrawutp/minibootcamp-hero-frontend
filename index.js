require('dotenv').config()
import './src/main.scss'

document.addEventListener('DOMContentLoaded', function() {
  let listHeroesDom = document.getElementById('list-heroes')
  let formHero = document.querySelector("form")

  if(listHeroesDom == null) { return }
  let url = process.env.API_URL + "/heroes"
  formHero.setAttribute("action",url);
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

  // Get all available jobs from backend
  let heroJobUrl = process.env.API_URL + "/hero_jobs"
  fetch(heroJobUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(resp => resp.json())
    .then(data => {
      
      let jobWrapper = document.getElementById('job-wrapper')
      if(jobWrapper == null) { return }

      console.log(data)
      buildJobDropdown(jobWrapper, data)
    })

  
})

function buildJobDropdown(targetDom, data) {
  targetDom.insertAdjacentHTML('afterbegin', `
    <select id="jobs" name="hero[job]">
      ${ data.jobs.map(item => { return `<option value=${item}>${item}</option>` }) }
      <option value=""></option>
    </select>
  `) 
}

function addHeaderTitleToHeroesList(targetDom) {
  targetDom.insertAdjacentHTML('afterbegin', `
    <div class="hero-header">
      <div>Name</div>
      <div>Job</div>
      <div>HP</div>
      <div>MP</div>
    </di>
  `)
}

function buildHeroDom(targetDom, data) {
  data.forEach(hero => {
    let htmlStr = `
      <div class="hero">
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.job}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
      </div>
    `
    targetDom.insertAdjacentHTML('beforeend', htmlStr) 
  })
}
