"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animales = exports.Centros = void 0;
const mongoose_1 = require("mongoose");
const CentroSchema = new mongoose_1.Schema({
    codigo: String,
    nombre: String,
    animalesLiberados: Number,
    financiacion: Number,
    animalesRefugiados: Number
}, {
    collection: 'centros'
});
const AnimalSchema = new mongoose_1.Schema({
    id: String,
    especie: String,
    nombre: String,
    centro: String,
    peso: Number,
    altura: Number,
}, {
    collection: 'animales'
});
exports.Centros = mongoose_1.model('centros', CentroSchema);
exports.Animales = mongoose_1.model('animales', AnimalSchema);
