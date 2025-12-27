// J.A.R.V.I.S. Protocol: Global Event Emitter
// Switch to Named Export to ensure singleton consistency

// Wir gehen davon aus, dass Phaser global via index.html geladen wird.
// Falls nicht, müsste hier: import Phaser from 'phaser'; stehen.

export const EventsCenter = new Phaser.Events.EventEmitter();
