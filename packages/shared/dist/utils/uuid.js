"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
const uuid_1 = require("uuid");
/**
 * Generates a new universally unique identifier (UUID).
 *
 * @returns {string} A randomly generated UUID.
 */
function generateUUID() {
    return (0, uuid_1.v4)();
}
