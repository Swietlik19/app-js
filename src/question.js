const getQuestionsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

const addToLocalStorage = question => {
  const all = getQuestionsFromLocalStorage();
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all))
}

const toCard = (question) => {
  return `
    <div class="mui--text-dark-secondary">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br>
  `
}

export class Question {
  static create(question) {
    return fetch('https://js-app-d98da-default-rtdb.europe-west1.firebasedatabase.app/question.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name
        return question
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">You don\'t have a token</p>')
    }
    return fetch(`https://js-app-d98da-default-rtdb.europe-west1.firebasedatabase.app/question.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          return `<p class="error">${response.error}</p>`
        }

        return response ? Object.keys(response).map(key => ({
          ...response[key],
          id: key
        })) : []
      })
  }

  static listToHtml(questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>No questions</p>'
  }


  static renderList() {
    const questions = getQuestionsFromLocalStorage()

    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div class="mui--text-headline">There're no questions</div>`

    const list = document.getElementById('list')
    list.innerHTML = html
  }
}
