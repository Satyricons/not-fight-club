// ============================================================
// 1. БАЗОВЫЙ КЛАСС Person
// ============================================================
class Person {
    constructor(name, hp) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
    }

    isAlive() {
        return this.hp > 0;
    }

    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        return this.hp;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return this.hp;
    }
}

// ============================================================
// 2. КЛАСС Botanist (игрок) с ограничениями
// ============================================================
class Botanist extends Person {
    constructor(name, hp, equipment = {}) {
        super(name, hp);
        this._equipment = {
            helmet: false,
            pads: false,
            bron: false,
            pants: false,
            shoes: false,
            ...equipment
        };
        this._equippedCount = 0;
        this._maxEquip = 2;
        this._attackCount = 0;
        this._attacksPerTurn = 1;
        
        // Пересчитываем _equippedCount на основе переданного оборудования
        this._equippedCount = Object.values(this._equipment).filter(v => v === true).length;
    }

    getEquipment() {
        return this._equipment;
    }

    getDefense() {
        return Object.keys(this._equipment).filter(key => this._equipment[key] === true);
    }

    getEquippedCount() { return this._equippedCount; }
    getMaxEquip() { return this._maxEquip; }
    canEquip() { return this._equippedCount < this._maxEquip; }
    canAttack() { return this._attackCount < this._attacksPerTurn; }
    resetAttacks() { this._attackCount = 0; }
    useAttack() {
        if (this.canAttack()) {
            this._attackCount++;
            return true;
        }
        return false;
    }

    hasDefenseForZone(zone) {
        const defenseMap = {
            'head': 'helmet',
            'shoulder': 'pads',
            'body': 'bron',
            'torso': 'pants',
            'legs': 'shoes'
        };
        const needed = defenseMap[zone];
        return needed ? this._equipment[needed] : false;
    }

    toggleItem(slot) {
        if (this._equipment[slot] === undefined) return null;
        
        if (this._equipment[slot]) {
            this._equipment[slot] = false;
            this._equippedCount--;
            return false;
        }
        
        if (this.canEquip()) {
            this._equipment[slot] = true;
            this._equippedCount++;
            return true;
        } else {
            showMessage(`⚠️ Максимум ${this._maxEquip} вещей!`, '#ff6b6b');
            return null;
        }
    }

    // ===== НОВОЕ: метод для получения данных для сохранения =====
    toJSON() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            equipment: this._equipment,
            equippedCount: this._equippedCount,
            attackCount: this._attackCount
        };
    }

    // ===== НОВОЕ: метод для загрузки данных из сохранения =====
    fromJSON(data) {
        this.name = data.name;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this._equipment = data.equipment;
        this._equippedCount = data.equippedCount || Object.values(this._equipment).filter(v => v === true).length;
        this._attackCount = data.attackCount || 0;
    }

    set helmet(v) { 
        if (v && !this.canEquip()) return;
        if (v !== this._equipment.helmet) {
            if (v) this._equippedCount++;
            else this._equippedCount--;
        }
        this._equipment.helmet = v; 
        this.updateOpacity('helmet'); 
    }
    get helmet() { return this._equipment.helmet; }
    
    set pads(v) { 
        if (v && !this.canEquip()) return;
        if (v !== this._equipment.pads) {
            if (v) this._equippedCount++;
            else this._equippedCount--;
        }
        this._equipment.pads = v; 
        this.updateOpacity('pads'); 
    }
    get pads() { return this._equipment.pads; }
    
    set bron(v) { 
        if (v && !this.canEquip()) return;
        if (v !== this._equipment.bron) {
            if (v) this._equippedCount++;
            else this._equippedCount--;
        }
        this._equipment.bron = v; 
        this.updateOpacity('bron'); 
    }
    get bron() { return this._equipment.bron; }
    
    set pants(v) { 
        if (v && !this.canEquip()) return;
        if (v !== this._equipment.pants) {
            if (v) this._equippedCount++;
            else this._equippedCount--;
        }
        this._equipment.pants = v; 
        this.updateOpacity('pants'); 
    }
    get pants() { return this._equipment.pants; }
    
    set shoes(v) { 
        if (v && !this.canEquip()) return;
        if (v !== this._equipment.shoes) {
            if (v) this._equippedCount++;
            else this._equippedCount--;
        }
        this._equipment.shoes = v; 
        this.updateOpacity('shoes'); 
    }
    get shoes() { return this._equipment.shoes; }

    updateOpacity(name) {
        const el = document.querySelector(`.slot-${name}`);
        if (el) {
            el.style.opacity = this._equipment[name] ? '1' : '0.3';
        }
    }

    updateAllDisplay() {
        Object.keys(this._equipment).forEach(key => {
            this.updateOpacity(key);
        });
    }
}

// ============================================================
// 3. КЛАСС Enemy (враг) с ограничениями
// ============================================================
class Enemy extends Person {
    constructor(name, hp, zones = {}) {
        super(name, hp);
        this._zones = {
            head: false,
            shoulder: false,
            body: false,
            torso: false,
            legs: false,
            ...zones
        };
        this._immunity = this.generateImmunity();
        this._attacksPerTurn = 2;
    }

    get zones() {
        return this._zones;
    }

    getZoneAtack() {
        return Object.keys(this._zones).filter(key => this._zones[key] === true);
    }

    generateImmunity() {
        const zones = ['head', 'shoulder', 'body', 'torso', 'legs'];
        const shuffled = [...zones].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 1);
    }

    getImmunity() {
        return this._immunity;
    }

    getAttacksPerTurn() {
        return this._attacksPerTurn;
    }

    // ===== НОВОЕ: метод для получения данных для сохранения =====
    toJSON() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            zones: this._zones,
            immunity: this._immunity
        };
    }

    // ===== НОВОЕ: метод для загрузки данных из сохранения =====
    fromJSON(data) {
        this.name = data.name;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this._zones = data.zones;
        this._immunity = data.immunity || this.generateImmunity();
    }

    set head(v) { this._zones.head = v; }
    get head() { return this._zones.head; }
    set shoulder(v) { this._zones.shoulder = v; }
    get shoulder() { return this._zones.shoulder; }
    set body(v) { this._zones.body = v; }
    get body() { return this._zones.body; }
    set torso(v) { this._zones.torso = v; }
    get torso() { return this._zones.torso; }
    set legs(v) { this._zones.legs = v; }
    get legs() { return this._zones.legs; }

    getZoneByName(name) {
        return this._zones[name] || false;
    }

    getRandomAttackZone() {
        const zones = ['head', 'shoulder', 'body', 'torso', 'legs'];
        return zones[Math.floor(Math.random() * zones.length)];
    }
}

// ============================================================
// 4. КОНФИГУРАЦИЯ
// ============================================================
const equipmentSlots = [
    { name: 'helmet', yStart: 0, yEnd: 145 },
    { name: 'pads', yStart: 145, yEnd: 160 },
    { name: 'bron', yStart: 160, yEnd: 255 },
    { name: 'pants', yStart: 255, yEnd: 297 },
    { name: 'shoes', yStart: 297, yEnd: 387 }
];

const enemyZones = [
    { name: 'head', yStart: 0, yEnd: 145 },
    { name: 'shoulder', yStart: 145, yEnd: 190},
    { name: 'body', yStart: 190, yEnd: 200 },
    { name: 'torso', yStart: 200, yEnd: 250 },
    { name: 'legs', yStart: 250, yEnd: 385 }
];

// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ С ЗАГРУЗКОЙ ИЗ localStorage
// ============================================================

// ===== НОВОЕ: функции для работы с localStorage =====
function saveGame() {
    try {
        const saveData = {
            player: newUser.toJSON(),
            enemy: newEnemy.toJSON(),
            isBattleActive: isBattleActive,
            isEnemyTurn: isEnemyTurn,
            timestamp: Date.now()
        };
        localStorage.setItem('botanist_game_save', JSON.stringify(saveData));
        console.log('💾 Игра сохранена!');
    } catch (e) {
        console.warn('⚠️ Ошибка сохранения:', e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('botanist_game_save');
        if (!saved) return false;
        
        const data = JSON.parse(saved);
        
        // Восстанавливаем игрока
        newUser.fromJSON(data.player);
        
        // Восстанавливаем врага
        newEnemy.fromJSON(data.enemy);
        
        // Восстанавливаем флаги
        isBattleActive = data.isBattleActive !== undefined ? data.isBattleActive : true;
        isEnemyTurn = data.isEnemyTurn || false;
        
        // Проверяем, жив ли враг (если был повержен)
        if (!newEnemy.isAlive()) {
            isBattleActive = false;
        }
        
        // Проверяем, жив ли игрок
        if (!newUser.isAlive()) {
            isBattleActive = false;
        }
        
        console.log('💾 Игра загружена из сохранения!');
        console.log(`👤 Игрок: ${newUser.name} (HP: ${newUser.hp})`);
        console.log(`🧛 Враг: ${newEnemy.name} (HP: ${newEnemy.hp})`);
        return true;
    } catch (e) {
        console.warn('⚠️ Ошибка загрузки сохранения:', e);
        return false;
    }
}

// ===== НОВОЕ: автосохранение через интервал =====
let autoSaveInterval = null;

function startAutoSave(intervalMs = 10000) {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (isBattleActive || !isBattleActive) {
            saveGame();
        }
    }, intervalMs);
    console.log(`🔄 Автосохранение каждые ${intervalMs/1000} секунд`);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// ============================================================
// 5a. СОЗДАНИЕ ПЕРСОНАЖЕЙ (с загрузкой или по умолчанию)
// ============================================================
let newUser = new Botanist('Игорь', 100, {
    helmet: false,
    pads: false,
    bron: false,
    pants: false,
    shoes: false
});

let newEnemy = new Enemy('Вампир Лёха', 80);

let isMouseOverPlayer = false;
let isBattleActive = true;
let isEnemyTurn = false;

// Пытаемся загрузить сохранение
const loaded = loadGame();

// Если сохранения нет или оно повреждено, используем значения по умолчанию
if (!loaded) {
    // Сбрасываем всё к начальным значениям
    newUser = new Botanist('Игорь', 100, {
        helmet: false,
        pads: false,
        bron: false,
        pants: false,
        shoes: false
    });
    newEnemy = new Enemy('Вампир Лёха', 80);
    isBattleActive = true;
    isEnemyTurn = false;
    console.log('🆕 Создана новая игра');
}

// ============================================================
// 6. ГЕНЕРАЦИЯ HTML
// ============================================================
function generateEquipmentHTML() {
    return equipmentSlots.map(slot => `
        <div class="equipment-slot slot-${slot.name}" style="display:none; opacity:0.3;">
            <img src="./image/person/${slot.name}.png" alt="${slot.name}" />
        </div>
    `).join('');
}

function generateEnemyZonesHTML() {
    return enemyZones.map(zone => `
        <div class="enemy-zone zone-${zone.name}" 
             style="display:none; position:absolute; left:0; top:${zone.yStart}%; width:100%; height:${(zone.yEnd - zone.yStart) * 0.5}%; background:rgba(255,215,0,0.15); border:1px dashed rgba(255,215,0,0.3); pointer-events:none; z-index:2;">
        </div>
    `).join('');
}

// Создаём HTML
document.querySelector('.field').insertAdjacentHTML(
    'beforeend',
    `
    <!-- ИГРОК -->
    <div class="container_player" id="playerContainer">
        <div class="skill" id="playerSkill">
            <div class="hp">❤️ ${newUser.hp}/${newUser.maxHp}</div>
            <div class="defense">🛡️ ${newUser.getDefense().join(', ') || 'нет'}</div>
            <div class="equip-info">📦 ${newUser.getEquippedCount()}/${newUser.getMaxEquip()}</div>
        </div>
        <div 
            class="player" 
            id="player"
            onmouseenter="mouseEnterHandler(event)" 
            onmouseleave="mouseLeaveHandler(event)" 
            onmousemove="getCoor(event)" 
            onclick="handleClick(event)"
        >
            <img src="./image/person/botanist.png" alt="Ботаник" />
            ${generateEquipmentHTML()}
        </div>
    </div>

    <!-- VS -->
    <div style="color:#4a4a6a; font-size:40px; font-weight:bold; text-shadow:0 0 30px rgba(100,50,200,0.3);">⚔️</div>

    <!-- ВРАГ -->
    <div class="container_player" id="enemyContainer">
        <div class="skill" id="enemySkill">
            <div class="hp">❤️ ${newEnemy.hp}/${newEnemy.maxHp}</div>
            <div class="immunity">🛡️ Иммунитет: ${newEnemy.getImmunity().join(', ')}</div>
            <div class="attack-info">⚔️ Атак за ход: ${newEnemy.getAttacksPerTurn()}</div>
        </div>
        <div 
            class="player" 
            id="enemy"
            onclick="handleClickEnemy(event)"
        >
            <img src="./image/person/vampir.png" alt="Вампир" />
            ${generateEnemyZonesHTML()}
        </div>
    </div>
    `
);

// ============================================================
// 7. ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================================
function updateUI() {
    // Игрок
    const playerSkill = document.getElementById('playerSkill');
    if (playerSkill) {
        const defense = newUser.getDefense();
        playerSkill.innerHTML = `
            <div class="hp">❤️ ${newUser.hp}/${newUser.maxHp}</div>
            <div class="defense">🛡️ ${defense.length ? defense.join(', ') : 'нет'}</div>
            <div class="equip-info">📦 ${newUser.getEquippedCount()}/${newUser.getMaxEquip()}</div>
        `;
    }

    // Враг
    const enemySkill = document.getElementById('enemySkill');
    if (enemySkill) {
        enemySkill.innerHTML = `
            <div class="hp">❤️ ${newEnemy.hp}/${newEnemy.maxHp}</div>
            <div class="immunity">🛡️ Иммунитет: ${newEnemy.getImmunity().join(', ')}</div>
            <div class="attack-info">⚔️ Атак за ход: ${newEnemy.getAttacksPerTurn()}</div>
        `;
    }

    // Обновляем отображение экипировки
    Object.keys(newUser._equipment).forEach(key => {
        const el = document.querySelector(`.slot-${key}`);
        if (el) {
            el.style.display = newUser._equipment[key] ? 'block' : 'none';
            el.style.opacity = newUser._equipment[key] ? '1' : '0.3';
        }
    });

    // Обновляем зоны врага
    enemyZones.forEach(zone => {
        const el = document.querySelector(`.zone-${zone.name}`);
        if (el) {
            el.style.display = newEnemy._zones[zone.name] ? 'block' : 'none';
        }
    });
}

// ============================================================
// 8. БОЕВАЯ СИСТЕМА
// ============================================================

// Показ сообщений
let messageTimeout = null;

function showMessage(text, color = '#ffffff', isPermanent = false) {
    const el = document.getElementById('battleMessage');
    if (!el) return;
    
    el.innerHTML = text;
    el.style.color = color;
    el.style.opacity = '1';
    
    if (messageTimeout) clearTimeout(messageTimeout);
    
    if (!isPermanent) {
        messageTimeout = setTimeout(() => {
            el.style.opacity = '0';
        }, 2500);
    }
}

function getZoneFromY(y, zones) {
    for (const zone of zones) {
        if (Math.round(y) >= zone.yStart && Math.round(y) <= zone.yEnd) {
            return zone.name;
        }
    }
    return null;
}

// Анимация удара
function animateHit(selector, intensity = 1) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    const offset = -20 * intensity;
    el.style.transform = `translateX(${offset}px)`;
    el.style.transition = '0.08s';
    el.style.filter = `brightness(2) drop-shadow(0 0 ${30 * intensity}px red)`;
    
    setTimeout(() => {
        el.style.transform = 'translateX(0)';
        el.style.filter = 'none';
    }, 300);
}

// ============================================================
// 8a. АТАКА ИГРОКА (1 раз за ход)
// ============================================================
function playerAttack(zoneName) {
    if (!isBattleActive) {
        showMessage('⏳ Битва уже закончена!', '#888');
        return;
    }
    
    if (!newEnemy.isAlive()) {
        showMessage('🏆 Враг уже повержен!', '#fdcb6e');
        return;
    }
    
    if (isEnemyTurn) {
        showMessage('⏳ Сейчас ход врага!', '#888');
        return;
    }
    
    if (!newUser.canAttack()) {
        showMessage('⏳ Вы уже атаковали!', '#888');
        return;
    }

    console.log(`⚔️ Атака по зоне: ${zoneName}`);
    
    const immunity = newEnemy.getImmunity();
    let damage = 0;
    let isImmune = false;
    let isCritical = false;
    
    if (immunity.includes(zoneName)) {
        isImmune = true;
        damage = Math.floor(Math.random() * 8) + 3;
        showMessage(`🛡️ Иммунитет! Урон: ${damage}`, '#a29bfe');
    } else {
        const baseDamage = Math.floor(Math.random() * 15) + 20;
        
        const zoneMultipliers = {
            'head': 1.5,
            'shoulder': 0.9,
            'body': 1.2,
            'torso': 1.0,
            'legs': 0.8
        };
        
        damage = Math.round(baseDamage * (zoneMultipliers[zoneName] || 1));
        
        if (Math.random() < 0.15) {
            damage = Math.round(damage * 1.8);
            isCritical = true;
        }
        
        const msg = isCritical ? '⭐ КРИТИЧЕСКИЙ УДАР! ' : '💥 Попадание! ';
        showMessage(`${msg}Урон: ${damage} ${isCritical ? '🔥' : ''}`, isCritical ? '#fdcb6e' : '#55efc4');
    }
    
    newUser.useAttack();
    
    newEnemy.takeDamage(damage);
    animateHit('#enemy', damage > 30 ? 1.5 : 1);
    
    if (!newEnemy.isAlive()) {
        newEnemy.hp = 0;
        showMessage(`🏆 ${newEnemy.name} ПОВЕРЖЕН! 🏆`, '#fdcb6e', true);
        isBattleActive = false;
        updateUI();
        saveGame(); // ===== НОВОЕ: сохраняем после победы =====
        return;
    }
    
    isEnemyTurn = true;
    showMessage('🔄 Ход врага...', '#888');
    setTimeout(() => {
        enemyAttackSequence();
    }, 600);
}

// ============================================================
// 8c. СЕРИЯ АТАК ВРАГА (2 раза подряд)
// ============================================================
function enemyAttackSequence() {
    if (!isBattleActive || !newUser.isAlive()) {
        isEnemyTurn = false;
        return;
    }

    let attacksDone = 0;
    const totalAttacks = newEnemy.getAttacksPerTurn();

    function doSingleEnemyAttack() {
        if (!isBattleActive || !newUser.isAlive() || attacksDone >= totalAttacks) {
            isEnemyTurn = false;
            newUser.resetAttacks();
            if (isBattleActive) {
                showMessage('⚔️ Твой ход! Атакуй!', '#55efc4');
            }
            updateUI();
            saveGame(); // ===== НОВОЕ: сохраняем после хода врага =====
            return;
        }

        console.log(`🔄 Атака врага ${attacksDone + 1}/${totalAttacks}`);
        
        const zone = newEnemy.getRandomAttackZone();
        const baseDamage = Math.floor(Math.random() * 15) + 10;
        
        let damage = baseDamage;
        
        const zoneMultipliers = {
            'head': 1.4,
            'shoulder': 0.8,
            'body': 1.1,
            'torso': 1.0,
            'legs': 0.7
        };
        damage = Math.round(damage * (zoneMultipliers[zone] || 1));
        
        const hasDefense = newUser.hasDefenseForZone(zone);
        
        if (hasDefense) {
            const reduction = Math.round(damage * 0.6);
            damage = Math.max(1, damage - reduction);
            showMessage(`🛡️ Защита! Урон: ${damage} (атака ${attacksDone + 1}/${totalAttacks})`, '#74b9ff', 1200);
        } else {
            if (Math.random() < 0.1) {
                damage = Math.round(damage * 1.7);
                showMessage(`💢 КРИТ врага! Урон: ${damage} (атака ${attacksDone + 1}/${totalAttacks})`, '#fd79a8', 1200);
            } else {
                showMessage(`💢 Враг атакует ${zone}! Урон: ${damage} (атака ${attacksDone + 1}/${totalAttacks})`, '#ff6b6b', 1200);
            }
        }
        
        newUser.takeDamage(damage);
        animateHit('#player', damage > 20 ? 1.5 : 1);
        attacksDone++;
        updateUI();
        
        if (!newUser.isAlive()) {
            newUser.hp = 0;
            showMessage(`💀 ${newUser.name} ПОВЕРЖЕН! 💀`, '#ff6b6b', true);
            isBattleActive = false;
            isEnemyTurn = false;
            updateUI();
            saveGame(); // ===== НОВОЕ: сохраняем после поражения =====
            return;
        }
        
        if (attacksDone < totalAttacks) {
            setTimeout(doSingleEnemyAttack, 500);
        } else {
            isEnemyTurn = false;
            newUser.resetAttacks();
            if (isBattleActive) {
                showMessage('⚔️ Твой ход! Атакуй!', '#55efc4');
            }
            updateUI();
            saveGame(); // ===== НОВОЕ: сохраняем после хода врага =====
        }
    }
    
    doSingleEnemyAttack();
}

// ============================================================
// 9. ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================

function mouseEnterHandler(event) {
    isMouseOverPlayer = true;
}

function mouseLeaveHandler(event) {
    isMouseOverPlayer = false;
    equipmentSlots.forEach(slot => {
        if (!newUser._equipment[slot.name]) {
            const el = document.querySelector(`.slot-${slot.name}`);
            if (el) el.style.display = 'none';
        }
    });
}

function getCoor(event) {
    if (!isMouseOverPlayer) return;
    
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = event.clientY - rect.top;

    equipmentSlots.forEach(slot => {
        const el = document.querySelector(`.slot-${slot.name}`);
        if (!el) return;
        
        const isInZone = Math.round(y) >= slot.yStart && Math.round(y) <= slot.yEnd;
        const isActive = newUser._equipment[slot.name];
        
        if (isInZone && !isActive) {
            el.style.display = 'block';
        } else if (!isActive) {
            el.style.display = 'none';
        }
    });
}

// Клик по игроку (переключение экипировки)
function handleClick(event) {
    if (isEnemyTurn) {
        showMessage('⏳ Сейчас ход врага!', '#888');
        return;
    }
    if (!isBattleActive) {
        showMessage('⏳ Битва окончена!', '#888');
        return;
    }
    
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = event.clientY - rect.top;
    
    equipmentSlots.forEach(slot => {
        const isInZone = Math.round(y) >= slot.yStart && Math.round(y) <= slot.yEnd;
        if (isInZone) {
            const newState = newUser.toggleItem(slot.name);
            if (newState !== null) {
                console.log(`🛡️ ${slot.name}: ${newState ? 'включён' : 'выключен'}`);
                showMessage(`🛡️ ${slot.name} ${newState ? 'включён' : 'выключен'} (${newUser.getEquippedCount()}/${newUser.getMaxEquip()})`, '#74b9ff');
                updateUI();
                saveGame(); // ===== НОВОЕ: сохраняем после смены экипировки =====
            }
        }
    });
}

// Клик по врагу (АТАКА!)
function handleClickEnemy(event) {
    if (isEnemyTurn) {
        showMessage('⏳ Сейчас ход врага!', '#888');
        return;
    }
    if (!isBattleActive) {
        showMessage('⏳ Битва окончена!', '#888');
        return;
    }
    if (!newUser.isAlive()) {
        showMessage('💀 Вы уже повержены!', '#ff6b6b');
        return;
    }
    if (!newEnemy.isAlive()) {
        showMessage('🏆 Враг уже повержен!', '#fdcb6e');
        return;
    }
    
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = event.clientY - rect.top;
    
    const zoneName = getZoneFromY(y, enemyZones);
    
    if (zoneName) {
        console.log(`🎯 Клик по зоне: ${zoneName}`);
        newEnemy._zones[zoneName] = true;
        playerAttack(zoneName);
        updateUI();
    } else {
        showMessage('❌ Клик мимо зоны!', '#888');
    }
}

// ============================================================
// 10. СБРОС БИТВЫ
// ============================================================
function resetBattle() {
    newUser.hp = newUser.maxHp;
    newUser.resetAttacks();
    newUser._equippedCount = 0;
    Object.keys(newUser._equipment).forEach(k => newUser._equipment[k] = false);
    newEnemy.hp = newEnemy.maxHp;
    newEnemy._immunity = newEnemy.generateImmunity();
    isBattleActive = true;
    isEnemyTurn = false;
    Object.keys(newEnemy._zones).forEach(key => {
        newEnemy._zones[key] = false;
    });
    updateUI();
    showMessage('🔄 Новая битва! Атакуй!', '#55efc4');
    console.log('🔄 Битва сброшена!');
    saveGame(); // ===== НОВОЕ: сохраняем после сброса =====
}

// ============================================================
// 11. ЗАПУСК
// ============================================================
updateUI();

// Если битва активна, показываем приветственное сообщение
if (isBattleActive) {
    showMessage('⚔️ Кликни по врагу, чтобы атаковать! (1 атака за ход)', '#aab');
} else if (!newUser.isAlive()) {
    showMessage(`💀 ${newUser.name} ПОВЕРЖЕН! Нажми "Новая битва"`, '#ff6b6b', true);
} else if (!newEnemy.isAlive()) {
    showMessage(`🏆 ${newEnemy.name} ПОВЕРЖЕН! Нажми "Новая битва"`, '#fdcb6e', true);
}

console.log('🎮 Игра загружена!');
console.log(`👤 Игрок: ${newUser.name} (HP: ${newUser.hp}, экипировка: ${newUser.getEquippedCount()}/${newUser.getMaxEquip()})`);
console.log(`🧛 Враг: ${newEnemy.name} (HP: ${newEnemy.hp}, иммунитет: ${newEnemy.getImmunity().join(', ')}, атак за ход: ${newEnemy.getAttacksPerTurn()})`);

// ===== НОВОЕ: запускаем автосохранение =====
startAutoSave(10000); // Сохраняем каждые 10 секунд

// ===== НОВОЕ: сохраняем при закрытии страницы =====
window.addEventListener('beforeunload', function() {
    saveGame();
    stopAutoSave();
});