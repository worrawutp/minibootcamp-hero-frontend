require('dotenv').config()
import './src/main.scss'

document.addEventListener('DOMContentLoaded', function() {
  let listHeroesDom = document.getElementById('list-heroes')
  let formHero = document.querySelector("#form-hero")
  let btnSubmitHero = document.querySelector("#btn-submit-hero")

  if(listHeroesDom == null) { return }
  let heroUrl = process.env.API_URL + "/heroes"

  formHero.setAttribute("action", heroUrl);

  fetch(heroUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    }
  }).then(resp => resp.json())
    .then(data => {
      buildHeroList(listHeroesDom, data)
      addHeaderTitleToHeroesList(listHeroesDom)
      assignClickEventForHeroItem()
  })

  // Get all available jobs from backend
  let heroJobUrl = process.env.API_URL + "/hero_jobs"
  fetch(heroJobUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    }
  }).then(resp => resp.json())
    .then(data => {
      
      let jobWrapper = document.getElementById('job-wrapper')
      if(jobWrapper == null) { return }

      console.log(data)
      buildJobDropdown(jobWrapper, data)
    })


  btnSubmitHero.onclick = () => {
    createHero()
  }

  function createHero() {
    let name = formHero.querySelector('#name').value
    let job = formHero.querySelector('#jobs').value
    let image = formHero.querySelector('#image').files[0]

    let formData = new FormData
    formData.append('hero[name]', name)
    formData.append('hero[job]', job)
    formData.append('hero[image]', image)

    let createHeroUrl = heroUrl
    fetch(createHeroUrl, {
      method: 'POST',
      body: formData
    })
    .then(resp => resp.json())
    .then(data => {
      insertNewHero(listHeroesDom, data)
    })
  }
})

function assignClickEventForHeroItem() {
  let heroItems = document.querySelectorAll('.hero')
  heroItems.forEach(item => {
    item.addEventListener('click', function(){
      // show hero Profile
    })
  })
}

function insertNewHero(heroList, hero) {
  let htmlStr = `
    <div class="hero">
      <a href="" class="hero-name">${hero.name}</a>
      <div>${hero.job}</div>
      <div>${hero.hp}</div>
      <div>${hero.mp}</div>
    </div>
  `
  heroList.insertAdjacentHTML('afterbegin', htmlStr) 
}

function buildJobDropdown(targetDom, data) {
  targetDom.insertAdjacentHTML('afterbegin', `
    <select id="jobs" name="hero[job]">
      ${ data.jobs.map(item => { return `<option value=${item}>${item}</option>` }) }
      <option value=""></option>
    </select>
  `) 
}

function addHeaderTitleToHeroesList(targetDom) {
  targetDom.insertAdjacentHTML('beforebegin', `
    <div class="hero-header">
      <div>Name</div>
      <div>Job</div>
      <div>HP</div>
    </di>
  `)
}

function buildHeroList(targetDom, data) {
  data.forEach(hero => {
    let heroData = {
      name: hero.name,
      hp: hero.hp,
      mp: hero.mp,
      job: hero.job,
      image_medium_url: hero.image_medium_url
    }
    let htmlStr = `
      <div class="hero" data-hero='${JSON.stringify(heroData)}'
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.job}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
      </div>
    `
    targetDom.insertAdjacentHTML('beforeend', htmlStr) 
  })
}

