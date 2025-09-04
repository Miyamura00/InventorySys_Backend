const bcrypt = require('bcrypt');
const { v4:uuidv4 } = require('uuid');
const { collection, addDoc, doc, getDoc, getDocs, query, where } = require('firebase/firestore')
const { db, USER_COLLECTION } = require('../config/firebase');

const registerUser = async (req, res) =>{
    try{
        const {name, email, password, designation } = req.body

        if(!name || !email || !password || !designation){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }

         const validDesignations = ['Super Admin', 'Admin', 'Staff']
         if(!validDesignations.includes(designation)){
             return res.status(400).json({
                 success: false,
                 message: "Invalid designation"
             })
         }
        
         const userRef = collection(db, USER_COLLECTION)
         const q = query(userRef, where('email', '==', email.toLowerCase().trim()))
         const existingUser = await getDocs(q)

         if(!existingUser.empty){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
         }

         const saltRounds = 10
         const hashedPassword = await bcrypt.hash(password, saltRounds)

         const userData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            designation,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
         }

         const docRef = await addDoc(collection(db, USER_COLLECTION), userData)

         const { password: _, ...userResponse } = userData
         userResponse.id = docRef.id

         res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
         })
    } catch (error){
        console.error("Error registering user: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const userRef = collection(db, USER_COLLECTION)
        const q = query(userRef, where('email', '==', email.toLowerCase().trim()))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const userDoc = querySnapshot.docs[0]
        const user = { id: userDoc.id, ...userDoc.data() }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const { password: _, ...userResponse } = user
        res.json({
            success: true,
            message: "Login successful",
            user: userResponse
        })
    } catch (error) {
        console.error("Error logging in user: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getAllUsers = async (req, res) =>{
    try{
        const usersRef = collection(db, USER_COLLECTION)
        const querySnapshot = await getDocs(usersRef)

        const users = []
        querySnapshot.forEach((doc) => {
            const userData = doc.data()
            const { password, ...userWithoutPassword } = userData
            users.push({
                id: doc.id,
                ...userWithoutPassword
            })
        })

        res.json({
            success: true,
            users: users
        })
    } catch (error){
        console.error("Error fetching users: ", error)
        res.status(500).json({
            success: false,
            message: "Error fetching users"
        })
    }
}

const getUserById = async (req, res) =>{
    try{
        const { id } = req.params

        const docRef = doc(db, USER_COLLECTION, id)
        const docSnap = await getDoc(docRef)

        if(!docSnap.exists()){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const userData = docSnap.data()
        const { password, ...userWithoutPassword } = userData

        res.json({
            success: true,
            user: {
                id: docSnap.id,
                ...userWithoutPassword
            }
        })
    } catch (error){
        console.error('Error fetching user:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById
}