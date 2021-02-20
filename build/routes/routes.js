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
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/centros', this.getCentros),
            this._router.get('/centro/:id', this.getCentro),
            this._router.post('/', this.postCentro);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
