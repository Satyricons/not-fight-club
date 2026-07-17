// Абстракция: мы скрываем сложность (как именно дышит человек)
// и показываем только важное (имя и возможность говорить).
class Person {
  constructor (name, hp) {
    this.name = name
    this.hp = hp
    this._energy = 100 // # - соглашение, что поле приватное
  } 

  // Геттер для приватного поля (Инкапсуляция)
  get energy () {
    return this._energy
  }

  // Сеттер с проверкой (Инкапсуляция)
  set energy (value) {
    if (value < 0) this._energy = 0
    else if (value > 100) this._energy = 100
    else this._energy = value
  }

}

// Наследование (extends)
class Botanist extends Person {
  constructor (name, hp, helmet, pads, bron) {
    super(name, hp)
    this._helmet = helmet
    this._pads = pads
    this._bron = bron
  }
  
  get helmet () {
    return this._helmet
  }
  set helmet (value) {
    this._helmet = value
    this.updateHelmetDisplay()
  }
  updateHelmetDisplay () {
    const el = document.querySelector('.helmet')
    if (el) el.style.display = this._helmet ? 'inline' : 'none'
  }

  get pads () {
    return this._pads
  }
  set pads (value) {
    this._pads = value
    this.updatePadsDisplay()
  }  
  updatePadsDisplay () {
    const el = document.querySelector('.pads')
    if (el) el.style.display = this._pads ? 'inline' : 'none'
  }

  get bron () {
    return this._bron
  }
  set bron (value) {
    this._bron = value    
    this.updateBronDisplay()
  }
  updateBronDisplay () {
    const bronElement = document.querySelector('.bron')
    if (bronElement) {
      bronElement.style.display = this._bron ? 'inline' : 'none'
    }
  }
}

//Инициализация

let isMouseOverPlayer = false

document.querySelector('.field').insertAdjacentHTML(
  'beforeend',
  `
    <div class="container_player">
        <div class="skill"></div>
        <div 
            onmouseenter="mouseEnterHandler(event)" 
            onmouseleave="mouseLeaveHandler(event)" 
            onmousemove="getCoor(event)" 
            onclick="handleClick(event)"
            class="player"             
        >
            <img src="./image/person/botanist.png" >

            <div class="helmet">
                <img src="./image/person/helmet.png" >
            </div>
            
            <div class="pads">
                <img src="./image/person/pads.png" >
            </div>

            <div class="bron">
                <img src="./image/person/bron.png" >
            </div>
        </div>
    </div>
`
)

//Мышь вошла в .player
function mouseEnterHandler (event) {
  isMouseOverPlayer = true
}

//Мышь покинула .player
function mouseLeaveHandler (event) {
  isMouseOverPlayer = false   
  if (!newUser.helmet) document.querySelector('.helmet').style.display = 'none'
  if (!newUser.pads) document.querySelector('.pads').style.display = 'none'
  if (!newUser._bron) document.querySelector('.bron').style.display = 'none'
}

function getCoor (event) {
  // Если мышь над .player выполняем:
  if (isMouseOverPlayer) {
    const container = event.currentTarget
    const rect = container.getBoundingClientRect()    
    
    const helmet = document.querySelector('.helmet')
    const pads = document.querySelector('.pads')
    const bron = document.querySelector('.bron')

    // Координаты мыши относительно контейнера
    // const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (Math.round(y) >= 0 && Math.round(y) <= 68 && !newUser._helmet) {
      helmet.style.display = 'inline'
    } else {
      if (!newUser._helmet) helmet.style.display = 'none'
    }

    if (Math.round(y) >= 68 && Math.round(y) <= 78 && !newUser._pads) {
      pads.style.display = 'inline'
    } else {
      if (!newUser._pads) pads.style.display = 'none'
    }

    if (Math.round(y) >= 78 && Math.round(y) <= 125 && !newUser._bron) {
      bron.style.display = 'inline'
    } else {
      if (!newUser._bron) bron.style.display = 'none'
    }
  }
}

function handleClick (event) {
  const container = event.currentTarget
  const rect = container.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Проверяем, что клик был в зоне
  if (Math.round(y) >= 0 && Math.round(y) <= 68) newUser.helmet = !newUser._helmet
  if (Math.round(y) >= 68 && Math.round(y) <= 78) newUser.pads = !newUser._pads
  if (Math.round(y) >= 78 && Math.round(y) <= 125) newUser.bron = !newUser._bron
}

let newUser = new Botanist('Игорь', 75, false, false, false)

//скиллы
document.querySelectorAll('.skill').forEach(el => {
  el.innerHTML = '<div>1</div><div>2</div><div>3</div>'
})
