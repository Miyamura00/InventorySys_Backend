const { db } = require("../config/firebase");
const { collection, addDoc, getDocs } = require("firebase/firestore");

// Add asset
const addAsset = async (req, res) => {
  try {
    const { modelName, brandName, purchaseDate, category, description, serialNumber, tag } = req.body;

    // Check duplicates
    const snapshot = await getDocs(collection(db, "assets"));
    if (snapshot.docs.some(doc => doc.data().serialNumber === serialNumber)) {
      return res.status(400).json({ success: false, message: "Serial number must be unique!" });
    }
    if (snapshot.docs.some(doc => doc.data().tag === tag)) {
      return res.status(400).json({ success: false, message: "Tag must be unique!" });
    }

    const docRef = await addDoc(collection(db, "assets"), {
      modelName,
      brandName,
      purchaseDate,
      category,
      description,
      serialNumber,
      tag,
      status: "In Stock", // default
      createdAt: new Date(),
    });

    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding asset:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all assets
const getAssets = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "assets"));
    const assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, assets });
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addAsset, getAssets };
