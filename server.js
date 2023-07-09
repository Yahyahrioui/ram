require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express()
const PORT = process.env.PORT || 8080

app.use(bodyParser({ extended: true }))

const connection = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`mongodb connect in: ${con.connection.host}`);
    } catch (err) {
        console.log('mongodb connection failed, error: ', err.message);
    }
}

connection()

const RoleSchaema = new mongoose.Schema({
    name: {
        type: String,
    },
    confirm: {
        type: String,
    },
    maitrise: {
        type: String,
    },
    justify: {
        type: String
    }
}, {
    timestamps: true
});
const Role = mongoose.model('Role', RoleSchaema)

const HistorySchaema = new mongoose.Schema(
  {
    history: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", HistorySchaema);

/*________________ROLE PATHES________________*/
app.get("/api/role", async (req, res) => {
    try {
        const data = await Role.find()
        return res.status(200).json({ success: true, length: data.length, data: data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/role", async (req, res) => {
    try {
        const { id, confirm, maitrise, justify } = req.body

        console.log({ id, confirm, maitrise, justify });

        const data = await Role.findByIdAndUpdate(
          { _id: id },
          {
            confirm: confirm,
            maitrise: maitrise,
            justify: justify,
          }
        )

        return res.status(200).json({ success: true, data: data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/role", async (req, res) => {
    try {
        const { name, confirm, maitrise, justify } = req.body;

        const data = new Role(
            {
                name: name,
                confirm: confirm,
                maitrise: maitrise,
                justify: justify,
            }
        );
        await data.save()

        return res.status(200).json({ success: true, data: data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});


app.delete("/api/role/:id", async (req, res) => {
    try {
        const data = await Role.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).json({ success: true, data: { _id: data._id, msg: `${req.params.id} deleted successfuly!` } });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

/*________________HISTORY PATHES________________*/
app.get("/api/history", async (req, res) => {
    try {
        const history = await History.find();
        return res.status(200).json({ success: true, data: history });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/history', async (req, res) => {
    try {
        const history = new History({
          history: req.body
        });
        await history.save()
        return res.status(200).json({ success: true, data: history });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
})

app.get('/', (req, res) => {
    return res.status(200).json({ success: true, data: 'Home' })
})

app.use(express.static(path.join(__dirname, "./client/build")))
app.get("*", function (_, res){
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function (err){
            res.status(500).send(err);
        }
    );
});

app.listen(PORT, console.log(`Server isl istening on port: http://localhost:${PORT}`))
