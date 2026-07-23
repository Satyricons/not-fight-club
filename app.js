class Person {
  constructor (name, hp) {
    this.name = name
    this.hp = hp
  } 
}

class Botanist extends Person {
  constructor (name, hp, helmet, pads, bron, pants, shoes) {
    super(name, hp)
    this._helmet = helmet
    this._pads = pads
    this._bron = bron
    this._pants = pants
    this._shoes = shoes
  }
  
  get helmet () {
    return this._helmet
  }
  set helmet (value) {
    this._helmet = value
    this.updateOpacity('helmet')
  }  

  get pads () {
    return this._pads
  }
  set pads (value) {
    this._pads = value
    this.updateOpacity('pads')
  }  
  
  get bron () {
    return this._bron
  }
  set bron (value) {
    this._bron = value    
    this.updateOpacity('bron')
  }  

  get pants () {
    return this._pants
  }
  set pants (value) {
    this._pants = value    
    this.updateOpacity('pants')
  }  

  get shoes () {
    return this._shoes
  }
  set shoes (value) {
    this._shoes = value    
    this.updateOpacity('shoes')
  }  

  updateOpacity (name) {
    document.querySelector(`.${name}`).style.opacity = this[`_${name}`] ? 1 : 0.7    
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

            <div class="pants">
                <img src="./image/person/pants.png" >
            </div>   

            <div class="bron">
                <img src="./image/person/bron.png" >
            </div>

            <div class="shoes">
                <img src="./image/person/shoes.png" >
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
  if (!newUser._pants) document.querySelector('.pants').style.display = 'none'
  if (!newUser._shoes) document.querySelector('.shoes').style.display = 'none'
}

function getCoor (event) {
  // Если мышь над .player выполняем:
  if (isMouseOverPlayer) {
    const container = event.currentTarget
    const rect = container.getBoundingClientRect()    
    
    const helmet = document.querySelector('.helmet')
    const pads = document.querySelector('.pads')
    const bron = document.querySelector('.bron')
    const pants = document.querySelector('.pants')
    const shoes = document.querySelector('.shoes')

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

    if (Math.round(y) >= 125 && Math.round(y) <= 155 && !newUser._pants) {
      pants.style.display = 'inline'
         } else {
      if (!newUser._pants) pants.style.display = 'none'
    }

    if (Math.round(y) >= 155 && Math.round(y) <= 197 && !newUser._shoes) {
      shoes.style.display = 'inline'
          } else {
      if (!newUser._shoes) shoes.style.display = 'none'
    }

  }
}

//клик:
function handleClick (event) {
  const container = event.currentTarget
  const rect = container.getBoundingClientRect()
  // const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Проверяем, что клик был в зоне
  if (Math.round(y) >= 0 && Math.round(y) <= 68) newUser.helmet = !newUser._helmet
  if (Math.round(y) >= 68 && Math.round(y) <= 78) newUser.pads = !newUser._pads
  if (Math.round(y) >= 78 && Math.round(y) <= 125) newUser.bron = !newUser._bron
  if (Math.round(y) >= 125 && Math.round(y) <= 150) newUser.pants = !newUser._pants
  if (Math.round(y) >= 155 && Math.round(y) <= 197) newUser.shoes = !newUser._shoes
}

let newUser = new Botanist('Игорь', 75, false, false, false, false, false)

//скиллы
document.querySelectorAll('.skill').forEach(el => {
  el.innerHTML = '<div>1</div><div>2</div><div>3</div>'
})
