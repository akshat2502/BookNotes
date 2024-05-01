import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express()
const port =3000;
app.set('view engine', 'ejs');

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "arora@1234",
    port: 5432,
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books=[
    // {
    // title: "random", 
    // isbn: "29382398239248240", 
    // Description: "hello i am under the water", 
    // rating: "3.4" },
];

app.get('/', async (req, res) => {
    try {
        const result= await db.query("SELECT * FROM books ORDER BY id ASC");
        books=result.rows;
      res.render("index.ejs", { 
        bookItems: books,
    });
  } catch (error) {
    console.log("yaha toh error hai")
  }
})

app.post('/add', async (req,res)=>{
    const {newtitle, newDescription, newIsbn, newRating}=req.body;
    if(!newtitle){
        return res.status(400).send("bhai title toh daalo.");
    }
    const parsedrating=parseFloat(newRating);
    if(isNaN(parsedrating) || parsedrating<0 || parsedrating>5) {
        return res.status(400).send("bhai rating should be b/w 0-5.");
    }
    try {
        // Insert the new book into the database
        await db.query("INSERT INTO books(title,description,isbn,rating) VALUES ($1,$2,$3,$4)", [newtitle, newDescription, newIsbn, newRating]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("The book already exists. Update/Edit option can be utilized.");
    }
})

app.get('/edit', async (req,res)=>{
   const isbnedit=req.query.isbn;
   try {
       const result= await db.query("SELECT * FROM books WHERE isbn=$1", [isbnedit]);
       const bookToEdit=result.rows[0];
       res.render("edit.ejs", { bookToEdit }); 
   } catch (error) {
    console.log("error hai bhaiya")
   }
});

app.post('/update', async(req,res)=>{
    const {updatedTitle, updatedDescription, updatedIsbn, updatedRating}=req.body;
    if(!updatedTitle){
        return res.status(400).send("bhai title toh daalo.");
    }
    const parsedrating=parseFloat(updatedRating);
    if(isNaN(parsedrating) || parsedrating<0 || parsedrating>5) {
        return res.status(400).send("bhai rating should be b/w 0-5.");
    }
    try {
        const result= await db.query("UPDATE books SET title=$1, description=$2, rating=$3 WHERE isbn=$4", [updatedTitle, updatedDescription, updatedRating, updatedIsbn]);
        res.redirect("/");
    } catch (error) {
        console.log("bhai firse error aaaaaayaa hai update krne se, check karo.")
    }
})

app.post('/delete', async (req, res) => {
   const deletedbook= req.body.isbn;
    try {
        const result= await db.query("DELETE FROM books WHERE isbn=$1", [deletedbook]);
      res.redirect("/");
  } catch (error) {
    console.log("yaha bhi error hai, delete karne pe")
  }
})

app.listen(port, ()=>{
    console.log("server is running on 3000");
});
