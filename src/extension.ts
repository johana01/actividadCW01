'use strict';
import * as vscode from 'vscode';

// La function activate realiza la negociación entre vscode y la extensión creada dicho de otra manera expone el API creado de manera publica 
// Se obliga a que el argumento de la funtion activate sea de tipo vscode.ExtensionContext y se llama context
export function activate(context: vscode.ExtensionContext) { 
    // Se crea variable local llamada disposable a la cual se le asigna un registro de comando
    // Se le asigna un nombre gapline al comando 
    // Se esta pasando un arrowFuntion al callback
    let disposable = vscode.commands.registerCommand('gapline', () => {
        // Se crea la variable editor la cual es una instancia para capturar la ventana activa del editor de vscode
        var editor = vscode.window.activeTextEditor;
        // Si no hay editor retorna sin agregar nada al contexto de vs.code
        if (!editor) { return; }
        // Se crea la variable selection para seleccionar la pantalla primaria de la ventana activa
        var selection = editor.selection;
        // Se crea la variable text que captura el texto de la pantalla primaria del editor
        var text = editor.document.getText(selection);
        // Se despliega una ventana de vscode para ingresar texto, en este caso el número de líneas
        // El texto a mostrar es "Líneas"
        // Es método showInputBox devuelve una respuesta asincrona la cual se captura por medio de un arrowFuntion mediante el argumento valor
        vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {
            //Almacena el número de las l+ienas que se han ingresado
            let numberOfLines = +value;
            //Se crea un arreglo de string vacio para almacenar partes de texto del código
            var textInChunks: Array<string> = [];
            // Separa el texto por línea de código y se recorre todo el arreglo
            // El metodo arrowFuntion tiene dos argumento el texto de la línea actual currentLine y el indice lineIndex
            text.split('\n').forEach((currentLine: string, lineIndex) => {
                // Agrega las líneas al arreglo 
                textInChunks.push(currentLine);
                // El indice actual más uno, modulo el número de lineas que agrega el usuario si es igual a 0 se agrega al arreglo una línea vacia
                if ((lineIndex + 1) % numberOfLines === 0) textInChunks.push('');
            });
            // Une los valores dentro del arreglo, agregando un caracter fin de linea (\n) en medio de cada valor del arreglo
            text = textInChunks.join('\n');
            // La ventana actual del editor le realiza una edición sobre el texto
            editor.edit((editBuilder) => {
                // captura el rango actual de la ventana seleccionaada del editor de texto
                var range = new vscode.Range(
                    selection.start.line, 0,
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );
                // Realiza el reemplazo del texto original de la ventana seleccionada con el texto procesado
                editBuilder.replace(range, text);
            });
        })
    });
    // Publica el comando en el contexto de las extensiones vscode
    context.subscriptions.push(disposable);
}

// Es la función de negociación para desvincular la extensión de vscode
export function deactivate() { }