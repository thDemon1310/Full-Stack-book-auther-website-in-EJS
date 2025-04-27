import express from "express";
const router = express.Router()

// All auther routes
router.get('/',(req,res)=>{
    res.render('authers/autherIndex')
})

// New Auther Routes
router.get('/new',(req,res)=>{
    res.render('authers/autherNew')
})

// Creating new auther routes
router.post('/',(req,res)=>{
    res.send('Create')
})

export default router