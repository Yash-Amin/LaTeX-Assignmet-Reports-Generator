const fs = require('fs');

function write(path, data, callback) {
    fs.writeFile(path, JSON.stringify(data), callback);
}
function writeRaw(path, data, callback) {
    fs.writeFile(path, data, callback);
}

function read(path, def, callback) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            return callback(err, def);
        } else {
            try {
                var obj = JSON.parse(data);
                callback(false, obj);
            } catch {
                callback(false, def);
            }
        }
    });
}
function escape(s) {
    var out = '';
    s = String(s);
    for (var c of s) {
        if (c == '#') {
            out += '\\#';
        } else if (c == '$') {
            out += '\\$';
        } else if (c == '%') {
            out += '\\%';
        } else if (c == '&') {
            out += '\\&';
        } else if (c == '\\') {
            out += '\\textbackslash{}';
        } else if (c == '^') {
            out += '\\textasciicircum{}';
        } else if (c == '_') {
            out += '\\_';
        } else if (c == '{') {
            out += '\\{';
        } else if (c == '}') {
            out += '\\}';
        } else if (c == '~') {
            out += '\\textasciitilde{}';
        } else {
            out += c;
        }
    }
    return out;
}

function getDetails(path, cb) {
    read(path + '/details.json', {}, function(err, data) {
        if (err) {
            return cb({});
        }
        data.practical = 'Practical - ' + data.practicalID;
        if (data.footer == 'C.S.P.I.T') {
            data.footer += '.';
        }
        if (isNaN(data.pageStart)) {
            data.pageStart = 1;
        }
        if (!data.subject) {
            data.subject = 'CE:346 Mobile App Development';
        }

        cb(data);
    });
}
function getTheory(path, callback) {
    read(path + '/theory.json', [], function(err, data) {
        if (err) {
            return callback([]);
        }
        callback(data);
    });
}

function getCode(path, callback) {
    read(path + '/code.json', [], function(err, data) {
        if (err) {
            return callback([]);
        }
        callback(data);
    });
}
function getOutput(path, callback) {
    read(path + '/output.json', [], function(err, data) {
        if (err) {
            return callback([]);
        }
        callback(data);
    });
}
function getQuestions(path, callback) {
    read(path + '/questions.json', [], function(err, data) {
        if (err) {
            return callback([]);
        }
        callback(data);
    });
}
function getReference(path, callback) {
    read(path + '/reference.json', [], function(err, data) {
        if (err) {
            return callback([]);
        }
        callback(data);
    });
}
function getAllDetails(path, callback) {
    getDetails(path, details => {
        getTheory(path, theory => {
            getCode(path, code => {
                getOutput(path, output => {
                    getQuestions(path, questions => {
                        getReference(path, reference => {
                            callback({
                                details,
                                theory,
                                code,
                                output,
                                questions,
                                reference
                            });
                        });
                    });
                });
            });
        });
    });
}

function getHeader(details) {
    return (
        '\\documentclass{article}\n\\usepackage[a4paper,' +
        'left=1.5cm,right=1cm,top=2cm,bottom=2cm]{geometry}\n' +
        '\\usepackage[document]{ragged2e}\n\\usepackage{listings}\n' +
        '\\usepackage{graphicx}\n\\usepackage{fancyhdr}\n\\renewcommand{' +
        '\\baselinestretch}{1.3} \n\\renewcommand{\\headrulewidth}{0pt}\n' +
        '\\pagestyle{fancy}\n\\fancyhf{}\n\\lhead{' +
        escape(details.subject) +
        '}\n' +
        '\\rhead{ID:' +
        details.id +
        '}\n\\setcounter{page}{' +
        details.pageStart +
        '}\n\\rfoot{Page \\thepage}\n\\lfoot{' +
        details.footer +
        '}\n' +
        '\\renewcommand{\\footrulewidth}{0.4pt} \n ' +
        ' \n\\begin{document}\n\\begin{center}\n\\LARGE{\\textbf{\\underline{' +
        details.practical +
        '}}}  \n\\end{center}\n\\Large{\\textbf{Aim:}}\\large{ \\justifying{' +
        escape(details.aim) +
        '} }\\par\n\\Large{\\textbf{Hardware Requirement:}}\\large{ \\justifying{' +
        escape(details.hwReq) +
        '}}\\par\n\\Large{\\textbf{Software Requirement:}}\\large{ \\justifying{' +
        escape(details.swReq) +
        '}}\\par\n\\Large{\\textbf{Knowledge Required:}}\\large{ ' +
        '\\justifying{' +
        escape(details.knowledge) +
        '}}\\par\n        '
    );
}

function getSection(section, figures, fakeName) {
    var out = '';
    try {
        if (!figures) {
            figures = 0;
        }
        if (section.type === 'newline') {
            out += ' \\\\~\\\\';
        }
        if (section.type === 'newpage') {
            out += ' \\pagebreak';
        }

        if (section.type === 'paragraph') {
            section.text = escape(section.text);
            out += ' \\large{\n\\justifying{ ' + section.text + ' }\\par}';
        } else if (section.type === 'java') {
            out +=
                '\\large{\\begin{lstlisting}[language = JAVA]\n' +
                section.text +
                '        \\end{lstlisting}\n';
        } else if (section.type === 'xml') {
            out +=
                '\\large{\\begin{lstlisting}[language = XML]\n' +
                section.text +
                '        \\end{lstlisting}\n';
        } else if (section.type === 'image') {
            out +=
                '         \\begin{center}\n        \\includegraphics' +
                '[width = '  
            //     section.width;
            // if (section.height && section.height != '') {
            //     out += ', height = ' + section.height;
            // }
            if (section.width) {
                if (!isNaN(section.width)){
                    section.width += 'cm'
                }
                out += section.width;
            } else {
                out += '12cm';
            }

            if (section.height && section.height != '') {
                if (String(section.height).endsWith('cm')) {
                    out += ', height = ' + section.height;
                } else if (!isNaN(section.height)) {
                    out += ', height = ' + section.height + 'cm';
                }
            }
            out +=
                ']{' +
                (fakeName
                    ? 'img' + figures + '.jpg'
                    : getImagePath(section.imageID)) +
                '}\\par Fig ' +
                ++figures +
                '. ' +
                escape(section.caption) +
                '\\par\n\\end{center}\n';
        }
    } catch (err) {}
    return [figures, out];
}

function getImagePath(img) {
    return 'Images/' + img + '.jpg';
}

function getTheoryLatex(theory, figures, fakeName) {
    var out = '\\Large{\\textbf{Theory:}}\\par';
    // console.log(theory)
    for (var section of theory) {
        var sec = getSection(section, figures, fakeName);
        out += sec[1];
        figures = sec[0];
    }
    return [figures, out];
}

function getCodeLatex(code) {
    // console.log('>>>', code)
    var out = '\\\\~\\\\\n        \\Large{\\textbf{Code:}}\\par';
    try {
        for (var section of code) {
            if (section.fileName.toLowerCase().endsWith('xml')) {
                out +=
                    ' \n\\Large{\\textbf{' +
                    section.fileName +
                    '}}\n\\large{\\begin{lstlisting}[language = XML]\n';
                out += '   ' + section.text.split('\n').join('\r\n   ');
                out += '\n\n\\end{lstlisting}\n        }\\par';
            } else if (section.fileName.toLowerCase().endsWith('java')) {
                out += '  \n\\Large{\\textbf{' + section.fileName;
                out += '}}\n\\large{\\begin{lstlisting}[language = JAVA]\n\n';
                out += '   ' + section.text.split('\n').join('\r\n   ');
                out += '\n\n\\end{lstlisting}\n        }\\par';
            } else {
                out += '\\justifying{ \n\\Large{\\textbf{' + section.fileName;
                ('}}}\n\\large{\\begin{lstlisting}');
                out += section.text;
                out += '\\end{lstlisting}\n        }\\par';
            }
        }
        return out;
    } catch (err) {
        return '';
    }
}

function getOutputLatex(op, figures, fakeName) {
    var out = '\\\\~\\\\\n     \\Large{\\textbf{Output:}\\par}\n         ';
    try {
        for (var section of op) {
            out +=
            '         \\begin{center}\n        \\includegraphics' +
            '[width = '  
        //     section.width;
        // if (section.height && section.height != '') {
        //     out += ', height = ' + section.height;
        // }
        if (section.width) {
            if (!isNaN(section.width)){
                section.width += 'cm'
            }
            out += section.width;
        } else {
            out += '12cm';
        }

        if (section.height && section.height != '') {
            if (String(section.height).endsWith('cm')) {
                out += ', height = ' + section.height;
            } else if (!isNaN(section.height)) {
                out += ', height = ' + section.height + 'cm';
            }
        }
        out +=
            ']{' +
            (fakeName
                ? 'img' + figures + '.jpg'
                : getImagePath(section.imageID)) +
            '}\\par Fig ' +
            ++figures +
            '. ' +
            escape(section.caption) +
            '\\par\n\\end{center}\n';

   
            /*            out +=
                '\n\\begin{center}\n\\includegraphics[width = '
                if (section.width) {
                    if (!isNaN(section.width)){
                        section.width += 'cm'
                    }
                    out += section.width;
                } else {
                    out += '12cm';
                }

                if (section.height && section.height != '') {
                    if (String(section.height).endsWith('cm')) {
                        out += ', height = ' + section.height;
                    } else if (!isNaN(section.height)) {
                        out += ', height = ' + section.height + 'cm';
                    }
                }
                //      + section.width;
            // if (section.height) {
            //     out += ', height = ' + section.height;
            // }
            out +=
                ']{' +
                (fakeName
                    ? 'img' + figures + '.jpg'
                    : getImagePath(section.imageID)) +
                +'}\\par Fig ' +
                ++figures +
                '. ' +
                escape(section.caption) +
                '\\par\n\\end{center}\\par \n'; */
        }
        return [figures, out];
    } catch (err) {
        return [figures, out];
    }
}

function getQuestionLatex(que, figures, fakeName) {
    if (que === [] || que === {}) {
        return [figures, ''];
    }
    var it = 1;
    var out =
        '\\\\~\\\\\n  \\Large{\\textbf{Questions:}}\n        \\begin{enumerate}\n';
    try {
        for (var section of que) {
            if (section.queOrAns === 'question') {
                it++;
                out +=
                    '            \\item \\textbf{ ' +
                    escape(section.text) +
                    '}\\par\n';
            } else {
                if (section.type === 'newline') {
                    it++;
                    out += '\\\\~\\\\';
                }
                if (section.type === 'newpage') {
                    it++;
                    out += '\\pagebreak';
                }

                if (section.type === 'paragraph') {
                    it++;
                    section.text = escape(section.text);
                    out +=
                        ' \\large{\n\\justifying{ ' + section.text + ' }\\par}';
                } else if (section.type === 'java') {
                    it++;
                    out +=
                        '\\large{\\begin{lstlisting}[language = JAVA]\n' +
                        section.text +
                        '        \\end{lstlisting}\n';
                } else if (section.type === 'xml') {
                    it++;
                    out +=
                        '\\large{\\begin{lstlisting}[language = XML]\n' +
                        section.text +
                        '        \\end{lstlisting}\n';
                } else if (section.type === 'image') {
                    it++;
                    out +=
                        '         \\begin{center}\n        \\includegraphics' +
                        '[width = ';
                    if (section.width) {
                        if (!isNaN(section.width)){
                            section.width += 'cm'
                        }
                        out += section.width;
                    } else {
                        out += '12cm';
                    }

                    if (section.height && section.height != '') {
                        if (String(section.height).endsWith('cm')) {
                            out += ', height = ' + section.height;
                        } else if (!isNaN(section.height)) {
                            out += ', height = ' + section.height + 'cm';
                        }
                    }
                    out +=
                        ']{' +
                        (fakeName
                            ? 'img' + figures + '.jpg'
                            : getImagePath(section.imageID)) +
                        +'}\\par Fig ' +
                        ++figures +
                        '. ' +
                        escape(section.caption) +
                        '\\par\n\\end{center}\n';
                }
            }
        }
        out += '      \n        \\end{enumerate}\n';
    } catch (err) {}
    if (it > 1) {
        return [figures, out];
    }
    return [figures, ''];
}

function getReferenceLatex(ref) { 
    if (ref == {} || ref == []) {
        return '';
    }
    var out =
        '\\\\~\\\\\n     \\Large{\\textbf{References:}}\\par\n        \\large{ ';
    // '1. ln0\\par2. ln1}\\par'
    var it = 1;
    try {
        for (var sec of ref) {
            if (sec.hasOwnProperty('text')) {
                out += it++ + escape('. ' + sec.text) + '\\par';
                it++;
            }
        }
        out += '}\\par';
    } catch (err) {}
    if (it > 1) {
        return out;
    }
    return '';
}

function createLatex(path, callback, fakeName) {
    // console.log('xxxx')
    try {
        getAllDetails(path, doc => {
            var latex = '';
            var figures = 0;
            // console.log(doc)
            var tmp = [];
            latex += getHeader(doc.details);
            tmp = getTheoryLatex(doc.theory, figures, fakeName);
            latex += tmp[1];
            figures = tmp[0];

            // Code
            latex += getCodeLatex(doc.code);

            // Output
            tmp = getOutputLatex(doc.output, figures, fakeName);
            latex += tmp[1];
            figures = tmp[0];

            // Question
            tmp = getQuestionLatex(doc.questions, figures, fakeName);
            latex += tmp[1];
            figures = tmp[0];

            latex += getReferenceLatex(doc.reference);

            latex += '\n\\end{document}';
            callback(latex);
            // writeRaw(latexDir + '/a.tex', latex, function(err) {
            //     // createPDF(latexDir + '/a.tex')
            //     // console.log('DOne')
            // });
        });
    } catch (err) {}
    // return latex;
}
function getImages(path, callback) {
    var images = [];
    getTheory(path, theory => {
        getOutput(path, output => {
            getQuestions(path, questions => {
                for (var section of [theory, output, questions])
                    for (var s of section) {
                        if (s['type'] === 'image') {
                            images.push(s.imageID);
                        }
                    }
                callback(images);
            });
        });
    });
}

// createLatex(latexDir, data => {
//     console.log('done', ++zz);
//     // writeRaw('a.txt', data, () => {
//     //     console.log('done');
//     // });
// });

module.exports = { createLatex };

// latex -include-directory=C:\Users\Yash\Desktop\z a.txt
// dvips -P pdf a.dvi
// ps2pdf a.ps
/*  
Run pdflatex ex.tex to produce a pdf file from the tex file directly.
Alternatively, after obtaining the dvi file from latex ex.tex,
run dvips -P pdf ex.dvi followed by ps2pdf ex.ps to produce a ps
file and then a pdf file, or dvipdfm ex.dvi to produce a pdf file.
 
*/

// function createPDF(filePath){
//     const latex = require('node-latex')
//     const input = fs.createReadStream(filePath)
//     const output = fs.createWriteStream(filePath + '.pdf')
//     const pdf = latex(input).pipe(output)
//     pdf.on('error', err => console.error(err))
//     pdf.on('finish', () => console.log('PDF generated!'))

// }

setTimeout(() => {}, 5000);
