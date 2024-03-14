const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DNS = require("./models/dns");
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
    "mongodb+srv://root:ruchi@cluster0.luuk7sp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

app.post("/insert", async (req, res) => {
    const { userName, data } = req.body;
    console.log(userName, data ,req.body);
    try {
        // Check if a record with the given username exists
        let userDNS = await DNS.findOne({ UserName: userName });
        const newDNSRecords = req.body.data.map(({ Domain, Type, Value }) => ({
            Domain: Domain || '',
            Type: Type || '',
            Value: Value || ''
        }));
        
        console.log(newDNSRecords,"========")
        if (!userDNS) {
            // If user does not exist, create a new record
            userDNS = new DNS({ UserName: userName, Data:newDNSRecords});
        }
        else if (userDNS) {
            // If user exists, update the Data array
            userDNS.Data.push(...newDNSRecords);
        }
        // Save the changes
        await userDNS.save();
        res.status(201).json(userDNS);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while saving DNS record." });
    }
});



app.get("/read", async (req, res) => {
    try {
        const results = await DNS.find({});
        res.status(200).json(results);
    } catch (err) {
        console.error("Error reading DNS records:", err);
        res.status(500).json({ error: "An error occurred while reading DNS records." });
    }
});
app.post("/readbyusername", async (req, res) => {
    try {
        const { userName } = req.body; // Extract userName from request body
        // You can also use req.params.userName if you prefer passing it as a parameter

        const results = await DNS.find({ UserName: userName }); // Find DNS records by userName
        res.status(200).json(results);
    } catch (err) {
        console.error("Error reading DNS records:", err);
        res.status(500).json({ error: "An error occurred while reading DNS records." });
    }
});


// app.put("/update", async (req, res) => {
//     const id = req.body.id;
//     const bookName = req.body.bookName;
//     const bookAuthor = req.body.bookAuthor;
//     const bookPrice = req.body.bookPrice;
//     const bookCategory = req.body.bookCategory;
//     try {
//         await BookModel.findById(id, (err, updateBook) => {
//             updateBook.bookName = bookName;
//             updateBook.bookAuthor = bookAuthor;
//             updateBook.bookPrice = bookPrice;
//             updateBook.bookCategory = bookCategory;
//             updateBook.save();
//             res.send("updated");
//         });
//     } catch (err) {
//         console.log(err);
//     }
// });

// app.delete("/delete/:id", async (req, res) => {
//     const id = req.params.id;
//     await BookModel.findByIdAndRemove(id).exec();
//     res.send("deleted");
// });

app.listen(3004, () => {
    console.log("server runnig on port 3004");
});
