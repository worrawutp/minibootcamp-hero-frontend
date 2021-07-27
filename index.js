require('dotenv').config()
import './src/main.scss'
import iconWranch from "/assets/icons/wranch.png"
import iconBin from "/assets/icons/bin.png"

document.addEventListener('DOMContentLoaded', function() {
  let listHeroTag = getListOfHeroTag()
  if(listHeroTag == null) { return }

  displayListOfHero()
  displayAvailableJobs()

  let btnSubmitHero = document.querySelector("#btn-submit-hero")
  btnSubmitHero.onclick = () => createHero()
})

function heroUrl() {
  return process.env.API_URL + "/heroes"
}

function getFormHeroTag() {
  return document.querySelector("#form-hero")
}

function getListOfHeroTag() {
  return document.getElementById('list-heroes')
}

function displayListOfHero() {
  fetch(heroUrl(), {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    }
  }).then(resp => resp.json())
    .then(data => {
      buildHeroList(data)
      setupHeaderTitleToHeroesList()
      assignClickEventForHeroItem()
  })
}

function displayAvailableJobs() {
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
}

function createHero() {
  let formHero = getFormHeroTag()
  let name = formHero.querySelector('#name').value
  let job = formHero.querySelector('#jobs').value
  let image = formHero.querySelector('#image').files[0]

  let formData = new FormData
  formData.append('hero[name]', name)
  formData.append('hero[job]', job)
  formData.append('hero[image]', image)

  let createHeroUrl = heroUrl()
  fetch(createHeroUrl, {
    method: 'POST',
    headers: {
      'Authorization': process.env.API_CREDENTIAL
    },
    body: formData
  })
  .then(resp => resp.json())
  .then(data => {
    insertNewHero(data)
  })
}

function assignClickEventForHeroItem() {
  let heroItems = document.querySelectorAll('.hero')
  heroItems.forEach(hero => {
    hero.addEventListener('click', function(){
      displayHeroProfile(hero) 
      assignClickEventForHeroName(hero.dataset.id)
    })
  })
}

function assignClickEventForHeroName(heroId) {
  let heroNameTag = document.querySelector('.hero-profile-name')
  heroNameTag.addEventListener('click', function() {
    let nameTag = event.currentTarget
    let nameInput = document.createElement('input')
    nameInput.setAttribute('type', 'text')
    nameInput.setAttribute('name', 'hero[name]')
    nameInput.setAttribute('value', nameTag.textContent)
    nameInput.dataset.id = heroId

    if(nameTag.children.length == 0) {
      nameTag.textContent = ''
      nameTag.appendChild(nameInput)
    }

    nameInput.focus()
    nameInput.addEventListener('blur', function(){
      updateHeroName(nameTag)
    })
  })
}

function updateHeroName(nameTag) {
  let inputNameTag = event.currentTarget
  let heroId = event.currentTarget.dataset.id
  let heroUpdateUrl = heroUrl() + "/" + heroId

  fetch(heroUpdateUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    },
    body: JSON.stringify({ hero: { name: inputNameTag.value } })
  })
  .then(resp => resp.json())
  .then(data => {
      inputNameTag.remove()
      nameTag.textContent = data.name
  })
}

function displayHeroProfile(hero) {
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

function insertNewHero(hero) {
  let heroList = getListOfHeroTag()
  let htmlStr = `
    <div class="hero">
      <a href="" class="hero-name">${hero.name}</a>
      <div>${hero.job}</div>
      <div>${hero.level}</div>
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

function setupHeaderTitleToHeroesList() {
  getListOfHeroTag().insertAdjacentHTML('beforebegin', `
    <div class="hero-header">
      <div>Name</div>
      <div>Job</div>
      <div>Lv</div>
      <div>HP</div>
      <div>MP</div>
    </di>
  `)
}

function buildHeroList(data) {
  let listHeroTag = getListOfHeroTag()
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
        <div>${hero.level}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
      </div>
    `
    listHeroTag.insertAdjacentHTML('beforeend', htmlStr) 
  })
}

