// FILE: js/ui/StationMenu.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: STATION MENU UI
 * * Verwaltet das HTML-Overlay für den Stationshandel.
 * * FIX: Updated to support Ship Components (Health & Cargo) refactoring.
 */

export default class StationMenu {
    constructor(scene) {
        this.scene = scene;
        this.currentStation = null;
        
        // Setup DOM Referenzen
        this.setupDOM();
        
        // State
        this.activeMarket = null;
        this.activeShipyard = null;
        this.activeMissions = null;
        this.selectedWareId = null;
        this.selectedEquipId = null;
        this.selectedMissionId = null;
    }

    setupDOM() {
        this.domMenu = document.getElementById('station-menu');
        if(!this.domMenu) {
            console.warn("StationMenu: DOM element #station-menu not found.");
            return;
        }

        this.domStationName = document.getElementById('station-name');
        this.domMarketList = document.getElementById('market-list');
        this.domShipyardList = document.getElementById('shipyard-list');
        this.domMissionList = document.getElementById('mission-list');

        this.domDetailName = document.getElementById('detail-name');
        this.domDetailInfo = document.getElementById('detail-info');

        this.domTradeControls = document.getElementById('trade-controls');
        this.domEquipControls = document.getElementById('equip-controls');
        this.domMissionControls = document.getElementById('mission-controls');

        this.domSlider = document.getElementById('trade-slider');
        this.domTradeAmount = document.getElementById('trade-amount');
        this.domTradeTotal = document.getElementById('trade-total');
        this.domEquipPrice = document.getElementById('equip-price');
        this.domMissionReward = document.getElementById('mission-reward');

        this.domPlayerCredits = document.getElementById('player-credits');
        this.domPlayerCargo = document.getElementById('player-cargo');

        this.btnNavMarket = document.getElementById('nav-market');
        this.btnNavShipyard = document.getElementById('nav-shipyard');
        this.btnNavMissions = document.getElementById('nav-missions');

        // DOM Event Listeners
        if (document.getElementById('btn-undock')) document.getElementById('btn-undock').onclick = () => this.handleUndock();

        if (this.btnNavMarket) this.btnNavMarket.onclick = () => this.switchTab('market');
        if (this.btnNavShipyard) this.btnNavShipyard.onclick = () => this.switchTab('shipyard');
        if (this.btnNavMissions) this.btnNavMissions.onclick = () => this.switchTab('missions');

        if (document.getElementById('btn-buy')) document.getElementById('btn-buy').onclick = () => this.executeTrade('buy');
        if (document.getElementById('btn-sell')) document.getElementById('btn-sell').onclick = () => this.executeTrade('sell');
        if (this.domSlider) this.domSlider.oninput = () => this.updateTradeCalculation();

        if (document.getElementById('btn-equip-buy')) document.getElementById('btn-equip-buy').onclick = () => this.executeEquipmentBuy();
        if (document.getElementById('btn-accept-mission')) document.getElementById('btn-accept-mission').onclick = () => this.executeAcceptMission();
    }

    open(station) {
        this.currentStation = station;
        console.log(`Opening Station Menu for ${station.name}...`);

        // --- CRITICAL: SYNC WITH UNIVERSE SIM ---
        station.syncWithSimulation();

        this.domMenu.classList.remove('hidden');
        this.domStationName.innerText = station.name.toUpperCase();

        this.activeMarket = station.market;
        this.activeShipyard = station.shipyard;
        this.activeMissions = station.availableMissions;

        this.switchTab('market');
        this.updatePlayerStatsUI();
        
        // Trigger save in scene
        this.scene.saveGameData();
    }

    handleUndock() {
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        this.domMenu.classList.add('hidden');
        this.scene.handleUndock();
    }

    switchTab(tab) {
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_hover');
        this.btnNavMarket.classList.remove('active');
        this.btnNavShipyard.classList.remove('active');
        this.btnNavMissions.classList.remove('active');

        this.domMarketList.classList.add('hidden');
        this.domShipyardList.classList.add('hidden');
        this.domMissionList.classList.add('hidden');

        this.domTradeControls.classList.add('hidden');
        this.domEquipControls.classList.add('hidden');
        this.domMissionControls.classList.add('hidden');

        this.domDetailName.innerText = "SELECT ITEM";
        this.domDetailInfo.innerHTML = "Select an item to view details.";

        if (tab === 'market') {
            this.btnNavMarket.classList.add('active');
            this.domMarketList.classList.remove('hidden');
            this.updateMarketList();
        } else if (tab === 'shipyard') {
            this.btnNavShipyard.classList.add('active');
            this.domShipyardList.classList.remove('hidden');
            this.updateShipyardList();
        } else if (tab === 'missions') {
            this.btnNavMissions.classList.add('active');
            this.domMissionList.classList.remove('hidden');
            this.updateMissionList();
        }
    }

    updatePlayerStatsUI() {
        const player = this.scene.player;
        
        // FIX: Access direct properties instead of .stats
        this.domPlayerCredits.innerText = `CREDITS: ${player.credits.toLocaleString()}`;
        
        // FIX: Use CargoComponent methods
        const currentVol = player.cargo.getUsedVolume();
        const maxVol = player.cargo.maxVolume;
        
        this.domPlayerCargo.innerText = `CARGO: ${currentVol} / ${maxVol}`;
    }

    updateMarketList() {
        this.domMarketList.innerHTML = '';
        if (!this.activeMarket) return;
        for (const [id, data] of Object.entries(this.activeMarket)) {
            const price = data.getPrice();
            const el = document.createElement('div');
            el.className = 'market-item';
            el.innerHTML = `
                <span>${id.replace('_', ' ').toUpperCase()}</span>
                <span>${data.stock}</span>
                <span>${price} Cr</span>
            `;
            el.onclick = () => this.selectMarketItem(id, data, el);
            this.domMarketList.appendChild(el);
        }
    }

    selectMarketItem(id, data, element) {
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        this.highlightItem(element);
        this.selectedWareId = id;
        this.domDetailName.innerText = id.replace('_', ' ').toUpperCase();
        
        // FIX: Access player stock via CargoComponent
        const playerStock = this.scene.player.cargo.getAmount(id);
        
        this.domDetailInfo.innerHTML = `
            Base Price: ${data.basePrice} Cr<br>
            Station Stock: ${data.stock} / ${data.capacity}<br>
            Player Stock: ${playerStock}
        `;
        this.domTradeControls.classList.remove('hidden');
        this.updateTradeCalculation();
    }

    updateTradeCalculation() {
        if (!this.selectedWareId || !this.activeMarket) return;
        const amount = parseInt(this.domSlider.value);
        this.domTradeAmount.innerText = amount;
        const data = this.activeMarket[this.selectedWareId];
        const price = data.getPrice();
        const total = amount * price;
        this.domTradeTotal.innerText = `TOTAL: ${total} CR`;
        
        const btnBuy = document.getElementById('btn-buy');
        const btnSell = document.getElementById('btn-sell');
        
        const player = this.scene.player;
        
        // FIX: Check credits directly
        const canBuy = (player.credits >= total) && (data.stock >= amount) && (amount > 0);
        btnBuy.disabled = !canBuy;
        
        // FIX: Check cargo via component
        const playerHas = player.cargo.getAmount(this.selectedWareId);
        const canSell = (playerHas >= amount) && (amount > 0);
        btnSell.disabled = !canSell;
    }

    executeTrade(type) {
        if (!this.selectedWareId || !this.activeMarket) return;
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        
        const amount = parseInt(this.domSlider.value);
        if (amount <= 0) return;
        
        const data = this.activeMarket[this.selectedWareId];
        const price = data.getPrice();
        const total = amount * price;
        const player = this.scene.player;

        if (type === 'buy') {
            // FIX: Direct credit manipulation & Cargo Component usage
            if (player.credits >= total && player.cargo.add(this.selectedWareId, amount)) {
                player.credits -= total;
                data.stock -= amount;
            }
        } else if (type === 'sell') {
            // FIX: Direct credit manipulation & Cargo Component usage
            if (player.cargo.remove(this.selectedWareId, amount)) {
                player.credits += total;
                data.stock += amount;
            }
        }
        
        this.domSlider.value = 0;
        this.updatePlayerStatsUI();
        this.updateMarketList();
        // Reselect to update info box
        this.selectMarketItem(this.selectedWareId, data, document.querySelector('.market-item.selected'));

        // CHECK MISSIONS ON SELL
        if (type === 'sell' && this.scene.missionManager) {
            const reward = this.scene.missionManager.checkSupplyMissionCompletion(this.currentStation.name, this.selectedWareId, amount);
            if (reward > 0) {
                player.credits += reward;
                this.updatePlayerStatsUI();

                // Mission Complete Notification
                const uiScene = this.scene.scene.get('UIScene');
                if (uiScene && uiScene.showLootNotification) {
                    uiScene.showLootNotification('MISSION COMPLETE', reward);
                }

                // Refresh Mission List if open
                if (!this.domMissionList.classList.contains('hidden')) {
                    this.updateMissionList();
                }
            }
        }

        this.scene.saveGameData();
    }

    updateShipyardList() {
        this.domShipyardList.innerHTML = '';
        if (!this.activeShipyard) return;
        this.activeShipyard.forEach(item => {
            const el = document.createElement('div');
            el.className = 'market-item';
            el.innerHTML = `
                <span>${item.name.toUpperCase()}</span>
                <span>∞</span>
                <span>${item.price} Cr</span>
            `;
            el.onclick = () => this.selectShipyardItem(item, el);
            this.domShipyardList.appendChild(el);
        });
    }

    selectShipyardItem(item, element) {
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        this.highlightItem(element);
        this.selectedEquipId = item.id;
        this.domDetailName.innerText = item.name.toUpperCase();
        this.domDetailInfo.innerHTML = `
            ${item.description}<br><br>
            Type: ${item.type}<br>
            Damage: ${item.damage}<br>
            Fire Rate: ${item.fireRate}/s<br>
            Range: ${item.range}m
        `;
        this.domEquipControls.classList.remove('hidden');
        this.domEquipPrice.innerText = `PRICE: ${item.price} CR`;
        
        const btnBuy = document.getElementById('btn-equip-buy');
        const player = this.scene.player;
        
        // FIX: Check credits directly
        const canBuy = (player.credits >= item.price);
        btnBuy.disabled = !canBuy;
        
        if(player.weaponSystem.activeWeaponId === item.id) {
            btnBuy.innerText = "INSTALLED";
            btnBuy.disabled = true;
        } else {
            btnBuy.innerText = "BUY & EQUIP";
        }
    }

    executeEquipmentBuy() {
        if (!this.selectedEquipId || !this.activeShipyard) return;
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        const item = this.activeShipyard.find(x => x.id === this.selectedEquipId);
        if(!item) return;

        const player = this.scene.player;

        // FIX: Direct credits manipulation
        if (player.credits >= item.price) {
            player.credits -= item.price;
            player.weaponSystem.equip(item.id);
            this.updatePlayerStatsUI();
            
            const btnBuy = document.getElementById('btn-equip-buy');
            btnBuy.innerText = "INSTALLED";
            btnBuy.disabled = true;
            
            this.scene.saveGameData();
        }
    }

    updateMissionList() {
        this.domMissionList.innerHTML = '';
        if (!this.activeMissions || this.activeMissions.length === 0) {
            this.domMissionList.innerHTML = '<div style="padding:10px; color:#666;">No urgent missions available.</div>';
            return;
        }

        this.activeMissions.forEach(mission => {
            const el = document.createElement('div');
            el.className = 'market-item';

            let color = '#00d4ff';
            if (mission.urgency === 'HIGH') color = '#ffaa00';
            if (mission.urgency === 'CRITICAL') color = '#ff3333';

            el.innerHTML = `
                <span style="color:${color}">${mission.title.toUpperCase()}</span>
                <span>${mission.reward} Cr</span>
                <span style="color:${color}">${mission.urgency}</span>
            `;
            el.onclick = () => this.selectMissionItem(mission, el);
            this.domMissionList.appendChild(el);
        });
    }

    selectMissionItem(mission, element) {
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');
        this.highlightItem(element);
        this.selectedMissionId = mission.id;

        this.domDetailName.innerText = mission.type.toUpperCase();
        this.domDetailInfo.innerHTML = `
            <strong>${mission.title}</strong><br><br>
            ${mission.description}<br><br>
            Required: ${mission.amount}x ${mission.wareId.toUpperCase()}<br>
            Reward: ${mission.reward} CR
        `;

        this.domMissionControls.classList.remove('hidden');
        this.domMissionReward.innerText = `PAYOUT: ${mission.reward} CR`;

        const btnAccept = document.getElementById('btn-accept-mission');
        const isAccepted = this.scene.missionManager.activeMissions.some(m => m.id === mission.id);

        if (isAccepted) {
            btnAccept.innerText = "ALREADY ACTIVE";
            btnAccept.disabled = true;
        } else {
            btnAccept.innerText = "ACCEPT OFFER";
            btnAccept.disabled = false;
            btnAccept.onclick = () => this.executeAcceptMission(mission);
        }
    }

    executeAcceptMission(mission) {
        if (!mission) return;
        if (this.scene.audioManager) this.scene.audioManager.playSfx('sfx_ui_select');

        if (this.scene.missionManager.acceptMission(mission)) {
            const btnAccept = document.getElementById('btn-accept-mission');
            btnAccept.innerText = "ACCEPTED (CHECK LOG)";
            btnAccept.disabled = true;

            const idx = this.activeMissions.indexOf(mission);
            if (idx > -1) this.activeMissions.splice(idx, 1);
            this.updateMissionList();
            this.scene.saveGameData();
        }
    }

    highlightItem(element) {
        const prev = document.querySelector('.market-item.selected');
        if (prev) prev.classList.remove('selected');
        element.classList.add('selected');
    }
}


