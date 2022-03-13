import express, { Request, Response } from "express";
import db from "../config/config"

export const controlTrial = async (req : Request, res : Response) => {
    try {
		
      db.query('SELECT * FROM parent',
      (err, result) => {
         if(err){
             console.log(err);
             res.json({message : "error"})
         }else{
             res.json({message : "success",result})
         }
     })

    } catch (error) {
        res.status(404).json( {message : 'Error'} )
    }
}