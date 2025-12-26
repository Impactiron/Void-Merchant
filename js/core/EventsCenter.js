// FILE: js/core/EventsCenter.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: EVENTS CENTER
 * * Zentraler Event-Bus für die Kommunikation zwischen losgelösten Systemen.
 * * Singleton Pattern.
 */

const events = new Phaser.Events.EventEmitter();

export default events;

