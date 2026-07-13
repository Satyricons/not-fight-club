// Абстракция: мы скрываем сложность (как именно дышит человек) 
// и показываем только важное (имя и возможность говорить).
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this._energy = 100; // _ (подчеркивание) - соглашение, что поле приватное
  }

  // Метод, доступный всем людям
  introduce() {
    return `Привет, я ${this.name}, мне ${this.age} лет.`;
  }

  // Геттер для приватного поля (Инкапсуляция)
  get energy() {
    return this._energy;
  }

  // Сеттер с проверкой (Инкапсуляция)
  set energy(value) {
    if (value < 0) this._energy = 0;
    else if (value > 100) this._energy = 100;
    else this._energy = value;
  }

  // Метод, который мы будем переопределять (Полиморфизм)
  work() {
    return `${this.name} работает.`;
  }
}


// Наследование (extends)
class Botanist extends Person {
  constructor(name, age, scientificField) {
    super(name, age); // Вызов конструктора родителя
    this.scientificField = scientificField; // Новое уникальное свойство
  }

  static isScientist() {
  return true;}

 #diary = 'Тайные заметки о папоротниках';
  revealSecret() {
    return this.#diary; // Доступ только через метод
  }


  // Полиморфизм: переопределяем метод work() родителя
  work() {
    // Вызываем метод родителя через super, но добавляем свою логику
    const baseWork = super.work(); 
    return `${baseWork} Изучает ${this.scientificField} в лаборатории.`;
  }

  // Уникальный метод ботаника
  describePlant(plantName) {
    return `${this.name} описывает новое растение: ${plantName}.`;
  }
}