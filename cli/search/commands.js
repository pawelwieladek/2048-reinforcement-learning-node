import _ from 'lodash';

import formBuilder from '../common/form-builder';
import runForm from './run';
import analyzeForm from './analyze';
import compareForm from './compare';

const Commands = {
    Run: 'Run',
    Analyze: 'Analyze',
    Compare: 'Compare'
};

function createForm(command) {
    switch (command) {
        case Commands.Run: return runForm;
        case Commands.Analyze: return analyzeForm;
        case Commands.Compare: return compareForm;
        default: throw new Error('Not implemented');
    }
}

export default formBuilder()
    .withQuestions([
        {
            type: 'list',
            name: 'command',
            message: 'Command',
            choices: _.values(Commands)
        }
    ])
    .withAnswersHandler(answers => {
        let form = createForm(answers.command);
        form.submit();
    })
    .build();

