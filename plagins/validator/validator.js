class Validator {
  constructor({selector, pattern = {}, method}) {

    this.form = document.querySelector(selector); //selector формы, может быть id, class и тд

    this.pattern = pattern; // кастомные шаблоны, которые мы можем вставлять не трогая код вылидатора

    this.method = method; // настройкиЮ указывающие какие поля должны валидироваться и что к ним применяется

    // Мы создали массив с помощью спрэд оператора '...' и фильтруем его 
    this.elementsForm = [...this.form.elements].filter(item => {
      return item.tagName.toLowerCase() !== 'BUTTON' &&
      item.type !== 'button';
    });
    
    /* Сюда будем передавать тот элемент, в котором ошибка валидации, а во время отправки submit, будем проверять наличие элементов*/
    this.error = new Set();
  }

  init () {
    // Стили
    this.applyStyle();

    this.setPattern();

    // bind this в функции checkIt, потому что контекст вызова this был input
    this.elementsForm.forEach(elem => elem.addEventListener('change', this.checkIt.bind(this)));

    this.form.addEventListener('submit', e => {
      
      e.preventDefault();
      
      this.elementsForm.forEach(elem => this.checkIt({target: elem}));

      if (this.error.size) {
        e.preventDefault();
      }
    });
  }

  // Проверяет на валидность
  isValid (elem) {
    const validatorMethod = {

      // Если поле пустое, функция вернет false, если нет то true
      notEmpty(elem) {
        if (elem.value.trim() === '') {
          return false;
        }
        return true;
      },

      // Принимаем pattern с помощью test
      pattern (elem, pattern) {
        return pattern.test(elem.value);
      }
    };

    if (this.method) {
      const method = this.method[elem.id];

      if (method) {
        return method.every(item => validatorMethod[item[0]](elem, this.pattern[item[1]]));
      }
    } else {
      console.warn('Необходимо передать селектор id полей ввода и методы проверки этих полей')
    }
    
    return true;
  }

  checkIt (event) {

    // Создаем элемент который вызвал событие
    const target = event.target;

    // Если валидация пройдена, то showSuccess, если нет, то showError
    if (this.isValid(target)) {
      this.showSuccess(target);
      this.error.delete(target);
    } else {
      this.showError(target);
      this.error.add(target);
    }
    console.log(this.error);
  }


  // Если input не прошел валидацию
  showError (elem) {
    elem.classList.remove('success');
    elem.classList.add('error');

    // Проверка на текст при ошибке валидации, если true то выполняем return
    if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')) {
      return;
    }

    // Создаем div
    const errorDiv = document.createElement('div');

    // Добавляем в div текст
    errorDiv.textContent = 'Ошибка в этом поле';

    // Присваиваем div класс
    errorDiv.classList.add('validator-error');

    // Добавим div в наш elem после него
    elem.insertAdjacentElement('afterend', errorDiv);
  }

  // Если input прошел валидацию
  showSuccess (elem) {
    elem.classList.remove('error');
    elem.classList.add('success');

    // Если пользователь исправил ошибку, проверяем есть ли элемент и у элемента справа класс error, если есть, то удаляем
    if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')) {
      elem.nextElementSibling.remove(); // удаляем класс
    }
  }

  // Стили
  applyStyle () {
    // Создаем новый стиль
    const style = document.createElement('style');

    style.textContent = `
      input.success {
        border: 2px solid green
      }

      input.error {
        border: 2px solid red
      }
      
      .validator-error {
        font-size: 12px;
        font-family: sans-serif;
        color: red
      }
      `;

    // Помещаем в head (HTML)
    document.head.appendChild(style);
  }

  setPattern () {

    if (!this.pattern.phone) {
      this.pattern.phone = /^\+?[78]([-()]*\d){10}$/;
    }

    if (!this.pattern.phone) {
      this.pattern.phone = /^\w+@\w+\.\w{2,}$/;
    }

    this.pattern.phone = /^$/;
    this.pattern.email = /^$/;
  }
}