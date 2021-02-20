import { Schema, model } from 'mongoose'

const CentroSchema = new Schema({
    codigo: String,
    nombre: String,
    animalesLiberados: Number,
    financiacion: Number,
    animalesRefugiados: Number
},{
    collection:'centros'
})


const AnimalSchema = new Schema({
    id: String,
    especie: String,
    nombre: String,
    centro: String,
    peso: Number,
    altura: Number,
},{
    collection:'animales'
})


export const Centros = model('centros', CentroSchema  )
export const Animales = model('animales', AnimalSchema  )
