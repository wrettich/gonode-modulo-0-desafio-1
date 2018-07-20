const express = require("express");
const nunjucks = require('nunjucks');
const path = require("path");
const bodyParser = require('body-parser');
const moment = require('moment');
const querystring = require("querystring");



const app = express();

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.set('view engine','njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {

	console.log(req.query);
	console.log(req.path);

	if ((req.path == "/minor" || req.path == "/major") && (!req.query.nome || !req.query.idade)) {
		console.log("sem parametros --- redirect");
		res.redirect("/");
	} else {
		next();
	}
})

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/check', (req, res) => {

	const { nome, dataNascimento } = req.body;
	const [dia, mes, ano] = dataNascimento.split('/');
	const dtNascimento = moment(`${ano}-${mes}-${dia}`);
	const idade = moment().diff(moment(dtNascimento, "DD/MM/YYYY"), "years");
	const query = querystring.stringify({
		"nome": nome,
		"idade": idade,
	});

	console.log(idade);

	if(idade >= 18) {
		res.redirect(`/major?${query}`);
	} else {
		res.redirect(`/minor?${query}`);
	}
});

app.get("/major", (req, res) => {
	res.render("major", { 'nome': req.query.nome, 'idade': req.query.idade});
});

app.get("/minor", (req, res) => {
	res.render("minor", { 'nome': req.query.nome, 'idade': req.query.idade });
});

app.listen(3000);

