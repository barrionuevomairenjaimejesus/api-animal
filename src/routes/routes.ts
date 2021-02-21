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
    
    private postAnimal = async (req: Request, res: Response) => {
        const { id, especie, nombre, centro, peso, altura } = req.body
        await db.conectarBD()
        const dSchema={
            id: id,
            especie: especie,
            nombre: nombre,
            centro: centro,
            peso: peso,
            altura: altura
        }
        const oSchema = new Animales(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    

    private getAnimal = async (req:Request, res: Response) => {
        const {  id,centro } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const a = await Animales.findOne({
                id: id,
                centro: centro
            })
            res.json(a)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private updateAnimal = async (req: Request, res: Response) => {
        const {id,centro} = req.params
        const {  especie, nombre, peso, altura } = req.body
        await db.conectarBD()
        await Animales.findOneAndUpdate({
            id: id,
            centro:centro
        },{
            id: id,
            especie: especie,
            nombre:nombre,
            centro: centro,
            peso: peso,
            altura: altura
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateCentro = async (req: Request, res: Response) => {
        const {codigo} =req.params
        const {  nombre,animalesLiberados,financiacion, animalesRefugiados } = req.body
        await db.conectarBD()
        await Centros.findOneAndUpdate({
            codigo: codigo
        },{
            codigo:codigo,
            nombre:nombre,
            animalesLiberados:animalesLiberados,
            financiacion:financiacion,
            animalesRefugiados:animalesRefugiados
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }


    private deleteAnimal = async (req: Request, res: Response) => {
        const { centro,id} = req.params
        await db.conectarBD()
        await Animales.findOneAndDelete(
            { id: id,centro: centro}, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Animal eliminado: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/centros', this.getCentros),
        this._router.get('/centro/:codigo', this.getCentro),
        this._router.post('/', this.postCentro),
        this._router.post('/animal', this.postAnimal),
        this._router.get('/animal/:id&:centro', this.getAnimal),
        this._router.post('/animal/:id&:centro', this.updateAnimal),
        this._router.post('/centro/:codigo', this.updateCentro),
        this._router.get('/deleteAnimal/:id&:centro', this.deleteAnimal)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router
