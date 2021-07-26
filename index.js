require('dotenv').config()
import './src/main.scss'
import iconWranch from "/assets/icons/wranch.png"
import iconBin from "/assets/icons/bin.png"

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
      headers: {
        'Authorization': process.env.API_CREDENTIAL
      },
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
  heroItems.forEach(hero => {
    hero.addEventListener('click', function(){
      displayHeroProfile(hero) 
    })
  })
}

function displayHeroProfile(hero) {
  // show hero Profile
  let heroProfileWrapper = document.getElementById('hero-profile-wrapper')
  let heroData = JSON.parse(hero.dataset.hero)

  heroProfileWrapper.innerHTML = `
    <div class="hero-profile">
      <div class="hero-profile-image">
        <img src="${heroData.image_medium_url}" alt="${heroData.name}" />
      </div>
      <div class="hero-profile-title">
        <div class="hero-profile-name">${heroData.name}</div>
        <div class="hero-profile-job">${heroData.job}</div>
      </div>
      <div class="hero-profile-power">
        <div class="item">
          <div class="item-label">Lv</div>
          <div class="item-value">${heroData.level}</div>
        </div>
        <div class="item">
          <div class="item-label">HP</div>
          <div class="item-value">${heroData.hp}</div>
        </div>
        <div class="item">
          <div class="item-label">MP</div>
          <div class="item-value">${heroData.mp}</div>
        </div>
      </div>
      <div class="hero-profile-buttons">
        <a type="button" class="btn-hero-delete" onclick="deleteHeroItem(${heroData.id})">
          <img src="${iconBin}" width="22px" height="22px"  alt="Delete hero" />
        </a>
        <a type="button" class="btn-hero-update">
          <img src="${iconWranch}" width="22px" height="22px" alt="Edit hero" />
        </a>
      </div>
    </div>
  `
}

window.deleteHeroItem = function(heroId) {
  if(confirm('Are you sure?')) {
    let heroItem = document.querySelector(`[data-id="${heroId}"]`)
    let heroProfileWrapper = document.getElementById('hero-profile-wrapper')

    if(heroItem != null) {
      heroItem.remove()
      heroProfileWrapper.innerHTML = ''
      // request server with method=DELETE
    }
  }
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
      <div>MP</div>
    </di>
  `)

}

function buildHeroList(targetDom, data) {
  data.forEach(hero => {
    let heroData = {
      id: hero.id,
      name: hero.name,
      level: hero.level,
      hp: hero.hp,
      mp: hero.mp,
      job: hero.job,
      image_medium_url: hero.image_medium_url.replace('http://localhost:3002', process.env.API_URL)
    }
    let htmlStr = `
      <div class="hero" data-id='${hero.id}' data-hero='${JSON.stringify(heroData)}'
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.job}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
      </div>
    `
    targetDom.insertAdjacentHTML('beforeend', htmlStr) 
  })
}

