const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer')



const app = express();

//CONECTING DB// APP CONFI
mongoose.connect('mongodb+srv://rpg:rpg@cluster0.0ddez.mongodb.net/blogleo?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false
  });
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'))


//SCHEMA
let blogSchema = mongoose.Schema({
    title: String,
    body: String,
});

//MODEL

let Blog = mongoose.model('Blog', blogSchema)



//ROTA RAIZ (GET)
app.get('/', (req, res) => {
    res.redirect('/blogs')
})


//ROTA INDEX (GET)

app.get('/blogs', (req, res) => {
    //RETRIEVING ALL BLOGS
    Blog.find({}, (error, blogs) => {
      if(error){
          console.log(error);
      }else{
        res.render('index', {blogs: blogs})
      }
    })
    
})

//RENDERIZA A ROTA DE CRIAR POSTAGENS (GET)
app.get('/blogs/new', (req, res) => {
    res.render('new')
})


//ROTA QUE CRIA AS POSTAGENS (POST)
app.post('/blogs', (req, res) => {
    //ccria a postagem
    Blog.create(req.body.blog, (error, newBlog) => {
      if(error){
          res.render('new')
      }else{
           //redireciona para a  pagina principal
          res.redirect('/blogs')
      }
    })
   
})
// ROTA DE VER TODA A PUBLICAÇÃO
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
      if(error){
        res.redirect('/blogs')
      }else{
        res.render('show', {blog:foundBlog})
      }
    })
});

//ROTA PARA EDITAR A PUBLICACAO (GET)
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (error, foundBlog)=>{
    if(error){
      res.redirect('/blogs')
    }else {
      res.render('edit', {blog:foundBlog})
    }
  })
});

//ROTA PARA ATUALIZAR A PUBLICACAO (PUT)
app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog)=> {
    if(error) {
      res.redirect('/blogs')
    }else{
      res.redirect('/blogs/' + req.params.id)
    }
  })
});


//ROTA PARA DELETAR
app.delete('/blogs/:id', (req, res) =>{

  Blog.findByIdAndRemove(req.params.id, (error)=> {
    if(error){
      res.redirect('/blogs')
    }else{
      res.redirect('/blogs')
    }
  })
});

let porta = process.env.PORT || 3000

app.listen(porta, (req, res) => {
  console.log('O servico esta rodando na porta', porta)
});