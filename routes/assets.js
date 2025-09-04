const express = require("express")
const router = express.Router()
const { db } = require("../firebase")
const { collection, addDoc, getDocs } = require("firebase/firestore")

router.post("/", async (req, res) => { 
    try {
        const { modelName, brandName, purchaseDate, category, 
            description, serialNumber, tag} = req.body

            const snapshot = await getDocs(collection(db, "assets"))
            if(snapshot.docs.some(doc => doc.data().serialNumber === serialNumber)) {
                return res.status(400).json({ error: "Serial Number must be unique" })
            }
            if(snapshot.docs.some(doc => doc.data().tag === tag)) {
                return res.status(400).json({ error: "Tag must be unique" })
            }

            const docRef = await addDoc(collection(db, "assets"), {
                modelName,
                brandName,
                purchaseDate,
                category,
                description,
                serialNumber,
                tag,
                status: "In Stock",
                createdAt: new Date()
            })
              res.json({ success: true, id: docRef.id });
        } catch (error) {
            console.error("Error adding asset: ", error)
            res.status(500).json({ success: false, message: "Server error" })
        }
    })
    
    router.get("/", async (req, res) => {
        try{
            const snapshot = await getDocs(collection(db, "assets"))
            const assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            res.json({ success:true, assets})
        } catch (error) {
            console.error("Error fetching assets:", error)
            res.status(500).json({ success: false, message: "Server error" })
        }
    
    })

    module.exports = router