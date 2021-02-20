import {Request, Response, Router } from 'express'
import { Centros, Animales } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getCentros = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Centros.aggregate([
                {
                    $lookup: {
                        from: 'animales',
                        localField: 'nombre',
                        foreignField: 'centro',
                        as: "animales"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getCentro = async (req:Request, res: Response) => {
        const { codigo } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Centros.aggregate([
                {
                    $lookup: {
                        from: 'animales',
                        localField: 'nombre',
                        foreignField: 'centro',
                        as: "animales"
                    }
                },{
                    $match: {
                        codigo:codigo
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private postCentro = async (req: Request, res: Response) => {
        const { codigo, nombre, animalesLiberados, financiacion, animalesRefugiados } = req.body
        await db.conectarBD()
        const dSchema={
            codigo: codigo,
            nombre: nombre,
            animalesLiberados: animalesLiberados,
            financiacion: financiacion,
            animalesRefugiados: animalesRefugiados
        }
        const oSchema = new Centros(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    
   

    misRutas(){
        this._router.get('/centros', this.getCentros),
        this._router.get('/centro/:id', this.getCentro),
        this._router.post('/', this.postCentro)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router
