const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   CLOUDINARY CONFIG
========================= */

cloudinary.config({

    cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
    process.env.CLOUDINARY_API_KEY,

    api_secret:
    process.env.CLOUDINARY_API_SECRET

});

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req,res) => {

    res.send("Eben Cooling Backend Running");

});

/* =========================
   GET GALLERY FILES
========================= */

app.get("/gallery", async (req,res) => {

    try{

        const result =
        await cloudinary.search

        .expression(
        "resource_type:image OR resource_type:video"
        )

        .sort_by("created_at","desc")

        .max_results(100)

        .execute();

        res.json(result.resources);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }

});

/* =========================
   DELETE IMAGE / VIDEO
========================= */

app.delete("/delete/:public_id", async (req,res) => {

    try{

        const publicId =
        req.params.public_id;

        const resourceType =
        req.query.resource_type || "image";

        const result =
        await cloudinary.uploader.destroy(

            publicId,

            {
                resource_type:resourceType
            }

        );

        res.json(result);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }

});

/* =========================
   SERVER
========================= */

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
    `Server running on port ${PORT}`
    );

});
