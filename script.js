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
        this._maxEquip = 2;          // Максимум 2 вещи
        this._minEquipToAttack = 2;  // НУЖНО ровно 2 вещи для атаки!
        this._attackCount = 0;
        this._attacksPerTurn = 1;
        
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
    
    // ===== НОВОЕ: проверка, может ли атаковать (нужно ровно 2 вещи) =====
    canAttack() {
        return this._equippedCount >= this._minEquipToAttack && this._attackCount < this._attacksPerTurn;
    }
    
    // ===== НОВОЕ: сообщение, почему нельзя атаковать =====
    getAttackBlockReason() {
        if (this._equippedCount < this._minEquipToAttack) {
            return `⚠️ Нужно надеть ${this._minEquipToAttack} вещи! (сейчас: ${this._equippedCount})`;
        }
        if (this._attackCount >= this._attacksPerTurn) {
            return '⏳ Вы уже атаковали!';
        }
        return null;
    }

    canEquip() { return this._equippedCount < this._maxEquip; }
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

    toJSON() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            zones: this._zones,
            immunity: this._immunity
        };
    }

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
// 5. ПЕРЕМЕННЫЕ
// ============================================================
let newUser = null;
let newEnemy = null;
let isMouseOverPlayer = false;
let isBattleActive = true;
let isEnemyTurn = false;
let messageTimeout = null;
let autoSaveInterval = null;

const STORAGE_KEYS = {
    PLAYER_NAME: 'botanist_player_name',
    GAME_SAVE: 'botanist_game_save'
};

// ============================================================
// 6. ФУНКЦИИ РАБОТЫ С ИМЕНЕМ
// ============================================================
function getSavedName() {
    try {
        return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || '';
    } catch (e) {
        return '';
    }
}

function savePlayerName(name) {
    try {
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
        console.log('💾 Имя сохранено:', name);
    } catch (e) {
        console.warn('⚠️ Ошибка сохранения имени:', e);
    }
}

function promptPlayerName() {
    return new Promise((resolve) => {
        const savedName = getSavedName();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a2e;
            padding: 40px;
            border-radius: 25px;
            border: 2px solid #3a3a5a;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        modalContent.innerHTML = `
            <h2 style="color: #c0c0e0; margin-bottom: 10px; font-size: 24px;">🌿 Введите имя ботаника</h2>
            <p style="color: #8899bb; margin-bottom: 20px; font-size: 14px;">Имя будет сохранено в localStorage</p>
            <input type="text" id="nameInput" value="${savedName}" 
                   style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid #3a3a5a; 
                          background: #0a0a14; color: #c0c0e0; font-size: 18px; text-align: center;
                          outline: none; transition: border-color 0.3s;"
                   placeholder="Введите имя..." maxlength="20">
            <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: center;">
                <button id="confirmName" 
                        style="background: #6c5ce7; color: white; border: none; padding: 10px 30px; 
                               border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;
                               transition: all 0.2s;">
                    ✅ Подтвердить
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        const input = modalContent.querySelector('#nameInput');
        input.focus();
        input.select();
        
        const confirmBtn = modalContent.querySelector('#confirmName');
        
        function confirmName() {
            const name = input.value.trim() || 'Ботаник';
            savePlayerName(name);
            modal.remove();
            resolve(name);
        }
        
        confirmBtn.addEventListener('click', confirmName);
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                confirmName();
            }
        });
        
        if (savedName) {
            const skipBtn = document.createElement('button');
            skipBtn.textContent = '📂 Использовать сохранённое';
            skipBtn.style.cssText = `
                background: transparent;
                color: #8899bb;
                border: 1px solid #3a3a5a;
                padding: 8px 20px;
                border-radius: 40px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 10px;
            `;
            skipBtn.onclick = () => {
                modal.remove();
                resolve(savedName);
            };
            modalContent.appendChild(skipBtn);
        }
    });
}

// ============================================================
// 7. ФУНКЦИИ СОХРАНЕНИЯ
// ============================================================
function saveGame() {
    if (!newUser || !newEnemy) return;
    
    try {
        const saveData = {
            player: newUser.toJSON(),
            enemy: newEnemy.toJSON(),
            isBattleActive: isBattleActive,
            isEnemyTurn: isEnemyTurn,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEYS.GAME_SAVE, JSON.stringify(saveData));
        console.log('💾 Игра сохранена!');
    } catch (e) {
        console.warn('⚠️ Ошибка сохранения:', e);
    }
}

function loadGame() {
    if (!newUser || !newEnemy) return false;
    
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_SAVE);
        if (!saved) return false;
        
        const data = JSON.parse(saved);
        
        newUser.fromJSON(data.player);
        newEnemy.fromJSON(data.enemy);
        
        isBattleActive = data.isBattleActive !== undefined ? data.isBattleActive : true;
        isEnemyTurn = data.isEnemyTurn || false;
        
        if (!newEnemy.isAlive()) {
            isBattleActive = false;
        }
        
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

// ============================================================
// 8. ГЕНЕРАЦИЯ HTML
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

function createGameHTML() {
    const field = document.querySelector('.field');
    if (!field) return;
    
    field.innerHTML = `
    <div class="container_player" id="playerContainer">
        <div class="skill" id="playerSkill">
            <div class="hp">❤️ ${newUser.hp}/${newUser.maxHp}</div>
            <div class="defense">🛡️ ${newUser.getDefense().join(', ') || 'нет'}</div>
            <div class="equip-info">📦 ${newUser.getEquippedCount()}/${newUser.getMaxEquip()}</div>
            <div class="player-name" style="color:#6c5ce7; font-weight:bold; font-size:14px;">👤 ${newUser.name}</div>
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

    <div style="color:#4a4a6a; font-size:40px; font-weight:bold; text-shadow:0 0 30px rgba(100,50,200,0.3);">⚔️</div>

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
    `;
}

// ============================================================
// 9. ОБНОВЛЕНИЕ UI
// ============================================================
function updateUI() {
    if (!newUser || !newEnemy) return;
    
    const playerSkill = document.getElementById('playerSkill');
    if (playerSkill) {
        const defense = newUser.getDefense();
        const equipped = newUser.getEquippedCount();
        const needToAttack = 2;
        const canAttack = newUser.canAttack();
        
        playerSkill.innerHTML = `
            <div class="hp">❤️ ${newUser.hp}/${newUser.maxHp}</div>
            <div class="defense">🛡️ ${defense.length ? defense.join(', ') : 'нет'}</div>
            <div class="equip-info">📦 ${equipped}/${newUser.getMaxEquip()}</div>
            <div class="attack-status" style="color: ${canAttack ? '#55efc4' : '#ff6b6b'}; font-weight:bold; font-size:13px;">
                ${canAttack ? '⚔️ ГОТОВ К АТАКЕ!' : `⚠️ Нужно ${needToAttack} вещи (сейчас ${equipped})`}
            </div>
            <div class="player-name" style="color:#6c5ce7; font-weight:bold; font-size:14px;">👤 ${newUser.name}</div>
        `;
    }

    const enemySkill = document.getElementById('enemySkill');
    if (enemySkill) {
        enemySkill.innerHTML = `
            <div class="hp">❤️ ${newEnemy.hp}/${newEnemy.maxHp}</div>
            <div class="immunity">🛡️ Иммунитет: ${newEnemy.getImmunity().join(', ')}</div>
            <div class="attack-info">⚔️ Атак за ход: ${newEnemy.getAttacksPerTurn()}</div>
        `;
    }

    Object.keys(newUser._equipment).forEach(key => {
        const el = document.querySelector(`.slot-${key}`);
        if (el) {
            el.style.display = newUser._equipment[key] ? 'block' : 'none';
            el.style.opacity = newUser._equipment[key] ? '1' : '0.3';
        }
    });

    enemyZones.forEach(zone => {
        const el = document.querySelector(`.zone-${zone.name}`);
        if (el) {
            el.style.display = newEnemy._zones[zone.name] ? 'block' : 'none';
        }
    });
}

// ============================================================
// 10. АВТОСОХРАНЕНИЕ
// ============================================================
function startAutoSave(intervalMs = 10000) {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (newUser && newEnemy) {
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
// 11. СООБЩЕНИЯ
// ============================================================
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
// 12. БОЕВАЯ СИСТЕМА
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
    
    // ===== НОВОЕ: проверка может ли атаковать =====
    if (!newUser.canAttack()) {
        const reason = newUser.getAttackBlockReason();
        if (reason) {
            showMessage(reason, '#ff6b6b');
        } else {
            showMessage('⏳ Вы не можете атаковать!', '#888');
        }
        return;
    }

    console.log(`⚔️ Атака по зоне: ${zoneName}`);
    
    const immunity = newEnemy.getImmunity();
    let damage = 0;
    let isCritical = false;
    
    if (immunity.includes(zoneName)) {
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
        saveGame();
        return;
    }
    
    isEnemyTurn = true;
    showMessage('🔄 Ход врага...', '#888');
    setTimeout(() => {
        enemyAttackSequence();
    }, 600);
}

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
                showMessage(`⚔️ ${newUser.name}, твой ход! Атакуй!`, '#55efc4');
            }
            updateUI();
            saveGame();
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
            saveGame();
            return;
        }
        
        if (attacksDone < totalAttacks) {
            setTimeout(doSingleEnemyAttack, 500);
        } else {
            isEnemyTurn = false;
            newUser.resetAttacks();
            if (isBattleActive) {
                showMessage(`⚔️ ${newUser.name}, твой ход! Атакуй!`, '#55efc4');
            }
            updateUI();
            saveGame();
        }
    }
    
    doSingleEnemyAttack();
}

// ============================================================
// 13. ОБРАБОТЧИКИ СОБЫТИЙ
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
                saveGame();
            }
        }
    });
}

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
    
    // ===== НОВОЕ: проверка перед атакой =====
    if (!newUser.canAttack()) {
        const reason = newUser.getAttackBlockReason();
        showMessage(reason || '⏳ Вы не можете атаковать!', '#ff6b6b');
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
// 14. СБРОС БИТВЫ
// ============================================================
function resetBattle() {
    if (!newUser || !newEnemy) return;
    
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
    showMessage(`🔄 Новая битва! ${newUser.name}, надень 2 вещи и атакуй!`, '#55efc4', 3000);
    console.log('🔄 Битва сброшена!');
    saveGame();
}

// ============================================================
// 15. ФУНКЦИЯ СМЕНЫ ИМЕНИ
// ============================================================
function changePlayerName() {
    if (!newUser) return;
    
    const newName = prompt('Введите новое имя ботаника:', newUser.name);
    if (newName && newName.trim()) {
        const trimmedName = newName.trim();
        newUser.name = trimmedName;
        savePlayerName(trimmedName);
        saveGame();
        updateUI();
        showMessage(`✅ Имя изменено на: ${trimmedName}`, '#55efc4');
        console.log(`🔄 Имя изменено на: ${trimmedName}`);
    }
}

// ============================================================
// 16. ИНИЦИАЛИЗАЦИЯ И ЗАПУСК
// ============================================================
async function initGame() {
    const playerName = await promptPlayerName();
    
    newUser = new Botanist(playerName, 100, {
        helmet: false,
        pads: false,
        bron: false,
        pants: false,
        shoes: false
    });
    
    newEnemy = new Enemy('Вампир Лёха', 80);
    
    const loaded = loadGame();
    
    if (!loaded) {
        newUser = new Botanist(playerName, 100, {
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
    
    createGameHTML();
    updateUI();
    startAutoSave(10000);
    
    if (isBattleActive) {
        const equipped = newUser.getEquippedCount();
        if (equipped < 2) {
            showMessage(`⚔️ ${newUser.name}, надень 2 вещи на персонажа, чтобы атаковать!`, '#fdcb6e', 4000);
        } else {
            showMessage(`⚔️ ${newUser.name}, кликни по врагу, чтобы атаковать!`, '#aab');
        }
    } else if (!newUser.isAlive()) {
        showMessage(`💀 ${newUser.name} ПОВЕРЖЕН! Нажми "Новая битва"`, '#ff6b6b', true);
    } else if (!newEnemy.isAlive()) {
        showMessage(`🏆 ${newEnemy.name} ПОВЕРЖЕН! Нажми "Новая битва"`, '#fdcb6e', true);
    }
    
    // Сохраняем при закрытии страницы
    window.addEventListener('beforeunload', function() {
        saveGame();
        stopAutoSave();
    });
    
    // Делаем функции глобальными для доступа из HTML
    window.resetBattle = resetBattle;
    window.mouseEnterHandler = mouseEnterHandler;
    window.mouseLeaveHandler = mouseLeaveHandler;
    window.getCoor = getCoor;
    window.handleClick = handleClick;
    window.handleClickEnemy = handleClickEnemy;
    window.changePlayerName = changePlayerName;
    
    console.log('🎮 Игра загружена!');
    console.log(`👤 Игрок: ${newUser.name} (HP: ${newUser.hp}, экипировка: ${newUser.getEquippedCount()}/${newUser.getMaxEquip()})`);
    console.log(`🧛 Враг: ${newEnemy.name} (HP: ${newEnemy.hp}, иммунитет: ${newEnemy.getImmunity().join(', ')}, атак за ход: ${newEnemy.getAttacksPerTurn()})`);
    console.log(`⚔️ Статус атаки: ${newUser.canAttack() ? 'ГОТОВ' : 'НУЖНО 2 ВЕЩИ'}`);
}

// ============================================================
// 17. ЗАПУСК ИГРЫ
// ============================================================
// Ждём загрузки DOM и запускаем игру
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, запускаем игру...');
    initGame();
});

// ============================================================
// 18. ОБРАБОТЧИК ДЛЯ КНОПКИ "НОВАЯ БИТВА"
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (newUser && newEnemy) {
                resetBattle();
            }
        });
        console.log('🔘 Кнопка "Новая битва" привязана');
    } else {
        console.log('⚠️ Кнопка "Новая битва" не найдена');
    }
});

console.log('✅ script.js полностью загружен!');