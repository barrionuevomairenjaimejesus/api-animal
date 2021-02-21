"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getCentros = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Centros.aggregate([
                    {
                        $lookup: {
                            from: 'animales',
                            localField: 'nombre',
                            foreignField: 'centro',
                            as: "animales"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getCentro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Centros.aggregate([
                    {
                        $lookup: {
                            from: 'animales',
                            localField: 'nombre',
                            foreignField: 'centro',
                            as: "animales"
                        }
                    }, {
                        $match: {
                            codigo: codigo
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postCentro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { codigo, nombre, animalesLiberados, financiacion, animalesRefugiados } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                codigo: codigo,
                nombre: nombre,
                animalesLiberados: animalesLiberados,
                financiacion: financiacion,
                animalesRefugiados: animalesRefugiados
            };
            const oSchema = new schemas_1.Centros(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.postAnimal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, especie, nombre, centro, peso, altura } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                id: id,
                especie: especie,
                nombre: nombre,
                centro: centro,
                peso: peso,
                altura: altura
            };
            const oSchema = new schemas_1.Animales(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getAnimal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, centro } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const a = yield schemas_1.Animales.findOne({
                    id: id,
                    centro: centro
                });
                res.json(a);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updateAnimal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, centro } = req.params;
            const { especie, nombre, peso, altura } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Animales.findOneAndUpdate({
                id: id,
                centro: centro
            }, {
                id: id,
                especie: especie,
                nombre: nombre,
                centro: centro,
                peso: peso,
                altura: altura
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateCentro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            const { nombre, animalesLiberados, financiacion, animalesRefugiados } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Centros.findOneAndUpdate({
                codigo: codigo
            }, {
                codigo: codigo,
                nombre: nombre,
                animalesLiberados: animalesLiberados,
                financiacion: financiacion,
                animalesRefugiados: animalesRefugiados
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteAnimal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { centro, id } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Animales.findOneAndDelete({ id: id, centro: centro }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        res.send(`No encontrado`);
                    }
                    else {
                        res.send('Animal eliminado: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/centros', this.getCentros),
            this._router.get('/centro/:codigo', this.getCentro),
            this._router.post('/', this.postCentro),
            this._router.post('/animal', this.postAnimal),
            this._router.get('/animal/:id&:centro', this.getAnimal),
            this._router.post('/animal/:id&:centro', this.updateAnimal),
            this._router.post('/centro/:codigo', this.updateCentro),
            this._router.get('/deleteAnimal/:id&:centro', this.deleteAnimal);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
