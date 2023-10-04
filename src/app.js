import { Question } from './question'
import {isValid, createModal} from './utils'
import { getAuthForm, authWithEmailAndPassword } from './auth'
import './styles.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

const submitFormHandler = (event) => {
  event.preventDefault()

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    submitBtn.disabled = true
    // Async request to server to save question
    Question.create(question).then(() => {
      input.value = ''
      input.className = ''
      submitBtn.disabled = false
    })
  }
}

const renderModalAfterAuth = (content) => {
  if (typeof content === 'string') {
    createModal('Error!', content)
  } else {
    createModal('Question list', Question.listToHtml(content))
  }
}

const authFormHandler = (event) => {
  event.preventDefault()

  const btn = event.target.querySelector('#submitForm')
  const email = event.target.querySelector('#email').value
  const password = event.target.querySelector('#password').value

  btn.disabled = true

  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
}

const openModal = () => {
  createModal('Authorization', getAuthForm())
  document
    .getElementById('auth-form')
    .addEventListener('submit', authFormHandler)
}

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
})

console.log('App works')
