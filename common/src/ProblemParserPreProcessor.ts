/* --------------------------------------------------------------------------------------------
* Copyright (c) Jan Dolejsi. All rights reserved.
* Licensed under the MIT License. See License.txt in the project root for license information.
* ------------------------------------------------------------------------------------------ */

'use strict';

// var Sync = require('sync');
import { PreProcessor, ShellPreProcessor, OutputAdaptor, Jinja2PreProcessor } from "./PreProcessors";

export class ProblemParserPreProcessor {
    problemCompletePattern = /^;;\s*!pre-parsing:\s*{\s*type:\s*"(command|jinja2)"\s*,\s*(command:\s*"([\w:\-/\\\. ]+)"\s*(,\s*args:\s*\[([^\]]*)\])?|data:\s*"([\w:\-/\\\. ]+)")\s*}/gm;

    constructor() {

    }

    process(templatedProblem: string, workingDirectory: string): string {

        let preProcessor: PreProcessor = null;

        this.problemCompletePattern.lastIndex = 0;
        let match = this.problemCompletePattern.exec(templatedProblem);
        if (match && match[1]) {
            switch (match[1]) {
                case "command":
                    let args: string[] = match[5] ? match[5].split(',').map(arg => arg.trim().slice(1, -1)) : [];
                    preProcessor = new ShellPreProcessor(match[3], args);
                    break;
                case "jinja2":
                    console.log("Jinja2 templates not yet supported.");

                    try {
                        preProcessor = new Jinja2PreProcessor(match[6], workingDirectory);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                default:
                    console.log("Not supported: " + match[1]);
            }
        }

        if (preProcessor) {
            let transformed: string = null;

            transformed = preProcessor.transformSync(templatedProblem, workingDirectory, new ConsoleOutputAdaptor());

            return transformed ? transformed : templatedProblem;
        }
        else {
            return templatedProblem;
        }
    }
}

class ConsoleOutputAdaptor implements OutputAdaptor {
    appendLine(text: string): void {
        console.info(text);
    }
    show(): void {
        // do nothing
    }
}

