class Validator {
  constructor(selector, pattern, method) {

    this.selector = selector; //selector формы, может быть id, class и тд

    this.pattern = pattern; // кастовые шаблоны, которые мы можем вставлять не трогая код вылидатора

    this.method = method; // настройкиЮ указывающие какие поля должны валидироваться и что к ним применяется
  }

  init () {
    this.applyStyle();
    console.log(this.selector);
  }

  // Если input не прошел валидацию
  showError (elem) {
    elem.classList.remove('success');
    elem.classList.add('error');

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
  }

  // Стили
  applyStyle () {
    // Создаем новый стиль
    const style = document.createElement('style');

    style.textContent = `
      input.success {
        border: 2px solid green;
      }

      input.error {
        border: 2px solid red;
      }`;

    // Помещаем в head (HTML)
    document.head.appendChild(style);
  }
}