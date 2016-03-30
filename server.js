var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var connection = mongoose.createConnection('mongodb://localhost/Animals');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'./static')));
app.set('views',path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function (req,res) {
	// body...
	Animal.find({}, function(err, animals){
		if (err) {
			console.log(err);
		}else {
			res.render('index', {animals:animals});
		}
	})
})

app.listen('8877',function(){
	console.log('listening to 8877');
})

// mongoose.connection.on('error', function(err){
	var AnimalSchema = new mongoose.Schema({
		name:String,
		weight:Number,
		color:String
	})
	
// });

var Animal = connection.model("Animals", AnimalSchema);
AnimalSchema.path('color').required(true, 'Color cannot be blank');
AnimalSchema.path('name').required(true, 'Name cannot be blank');
AnimalSchema.path('weight').required(true, 'Weight cannot be blank');
var errors = [];
app.get('/animals/new', function(req,res){
	res.render('new');
})

app.post('/animals', function(req,res){
	console.log(req.body);
	var animal = new Animal(req.body);
	animal.save(function(err){
		if(err){
			res.render('new', {title: 'You have errors', errors:animal.errors})
		}else{
			res.redirect('/')
		}
	})
})

app.get('/animals/:id' ,function(req,res){
	console.log(req.params.id);
	Animal.find({_id:req.params.id}, function(err,animal){
		if (err) {
			console.log(err);
		}else{
			res.render('oneAnimal', {animal:animal})
		}
	})
})

app.get('/animals/:id/edit', function(req,res){
	Animal.find({_id:req.params.id}, function(err,animal){
		if (err) {
			console.log(err);
		}else{
			res.render('editAnimal', {animal:animal})
		}
	})
})

app.post('/animals/:id', function(req,res){
	console.log(req.params.id)
	console.log(req.body.name)
	Animal.update({_id:req.params.id},{name:req.body.name, weight:req.body.weight, color:req.body.color},function(err, animal){
		if (err) {
			console.log(err)
		}else {
			res.redirect('/animals/'+req.params.id);
		}
	})
})

app.post('/animals/:id/destory', function(req,res){
	Animal.remove({_id:req.params.id}, function(err){
		if (err) {
			console.log(err)
		}else {
			res.redirect('/')
		}
	})
})









