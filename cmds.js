const {log, biglog, errorlog, colorize} = require("./out");
const model = require("./model");
var x;
const helpCmd = rl => {
	log("Commandos:");
	log("h|help - Muestra esta ayuda.");
 	log("list - Listar los quizzes existentes.");
 	log("show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	log("add - Añadir un nuevo quiz interactivamente.");
	log("delete <id> - Borrar el quiz indicado.");
 	log("edit <id> - Editar el quiz indicado.");
 	log("test <id> - Probar el quiz indicado.");
 	log("p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
 	log("credits - Créditos.");
 	log("q|quit - Salir del programa.");
 	rl.prompt();
};

const addCmd = rl => {
	rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});
};

const listCmd = rl => {
model.getAll().forEach((quiz, id) => {
	log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
});

	rl.prompt();
};

const showCmd = (rl, id) => {
	if (typeof id == "undefined") {
		errorlog('Falta el parametro id.');
	} else{
		try {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		}	catch(error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
};

const deleteCmd = (rl, id) => {
	if (typeof id == "undefined") {
		errorlog('Falta el parametro id.');
	} else{
		try {
			log(`Pregunta [${colorize(id, 'magenta')}] eliminada.`);
			model.deleteByIndex(id);
		}	catch(error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
};

const editCmd = (rl, id) => {
	if (typeof id == "undefined") {
		errorlog('Falta el parametro id.');
		rl.prompt();
	} else{
		try {
			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

			rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);

				rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
					model.update(id, question, answer);
					log(` Se ha cambiado el quiz [${colorize(id, 'magenta')}] por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
				});
			});
		}	catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	};
};

const testCmd = (rl, id) => {
	if (typeof id == "undefined") {
		errorlog('Falta el parametro id.');
		rl.prompt();
	} else{
		try {
			const quiz = model.getByIndex(id);

			rl.question(colorize(`${quiz.question}: `, 'red'), respuesta => {
				respuesta=(respuesta || "").trim();
				if(respuesta.toLowerCase()===quiz.answer.toLowerCase()){
					biglog('CORRECTO', 'green');
					console.log("correct");
				}
				else{
					biglog('INCORRECTO', 'red');
					console.log("incorrect");
				}
				rl.prompt();
			});
		}	catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};

const playCmd = rl => {
	if (model.count() == 0){
		log("No hay nada que preguntar.", 'red');
		rl.prompt();
		return;
	}
	var preguntas = [];
	for (var i = 0; i < model.count(); i++) {
	preguntas.push(i);
	}

	let score = 0;
	juega(rl, score, preguntas);
			
	
};

const creditsCmd = rl => {
	console.log("Autores de la práctica:");
    log("Marco Antonio Martín Herrera", 'green');
    rl.prompt();
};

const aleatorio = (min,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
};

const juega = (rl,score, preguntas) => {

var id =aleatorio(0,preguntas.length-1);
const quiz = model.getByIndex(preguntas[id]);

rl.question(colorize(`${quiz.question}: `, 'red'), respuesta => {
	respuesta=(respuesta || "").trim();
	if(respuesta.toLowerCase()===quiz.answer.toLowerCase()){
		biglog('CORRECTO', 'green');
		console.log("correct");
		score++;
		preguntas.splice(id,1);
		if(preguntas.length==0){
			biglog("¡HAS GANADO!", "yellow");
			console.log("Puntuación final: ");
			biglog(score, 'magenta');
			rl.prompt();
			return;
		}
		console.log("Puntuación actual: ");
		biglog(score, 'magenta');
		juega(rl, score, preguntas);
	}
	else{
		biglog('INCORRECTO', 'red');
		console.log("incorrect");
		console.log("Fin");
		console.log("Tu puntuación fue: ");
		biglog(score, 'magenta');
		rl.prompt();
		return;
	}
});
}


exports = module.exports = {
	aleatorio,
	creditsCmd,
	helpCmd,
	playCmd,
	showCmd,
	testCmd,
	editCmd,
	deleteCmd,
	listCmd,
	addCmd
};