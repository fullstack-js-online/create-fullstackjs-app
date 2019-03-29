const superb = require('superb')
const randomstring = require('randomstring')

module.exports = {
    prompts() {
        return [
            {
                name: 'name',
                message: 'What is the name of the new project',
                default: this.outFolder,
                filter: val => val.toLowerCase()
            },
            {
                name: 'description',
                message: 'How would you descripe the new project',
                default: `my ${superb()} project`
            },
            {
                name: 'server',
                message: 'What server would you like to use as your backend ?',
                type: 'list',
                choices: ['express'],
                default: 'express'
            },
            {
                name: 'database',
                message:
                    'What database would you like to use with your backend ?',
                type: 'list',
                choices: [
                    { name: 'mongodb/mongoose', value: 'mongodb' },
                    { name: 'mysql/objectionjs', value: 'mysql' }
                ],
                default: 'mongodb'
            },
            {
                name: 'client',
                message:
                    'What frontend javascript library would you like to use?',
                type: 'list',
                choices: [
                    { name: 'React js', value: 'react' },
                    // { name: 'Next js', value: 'next' },
                    // { name: 'Nuxt js', value: 'nuxt' },
                    { name: 'Vue js', value: 'vue' }
                ],
                default: 'reactjs'
            },
            {
                name: 'features',
                message: 'Choose features to install',
                type: 'checkbox',
                choices: [
                    {
                        name: 'Linter / Formatter',
                        value: 'linter'
                    },
                    {
                        name: 'Prettier',
                        value: 'prettier'
                    }
                ],
                default: []
            },
            {
                name: 'ui',
                message: 'What frontend framework would you like to use ?',
                type: 'list',
                choices: [
                    // 'none',
                    // 'bootstrap',
                    'tailwind'
                ],
                default: 'tailwind'
            },
            {
                name: 'test',
                message: 'What testing framework would you like to use ?',
                type: 'list',
                choices: ['none', 'jest'],
                default: 'none'
            },
            {
                name: 'pm',
                message: 'Choose a package manager',
                choices: ['npm', 'yarn'],
                type: 'list',
                default: 'npm'
            }
        ]
    },
    actions() {
        const actions = []

        actions.push({
            type: 'add',
            files: [
                '**',
                '!./express/**/*',
                '!./react/**/*',
                '!./vue/**/*',
                '!./tests/**/*',
                '!./mocks/**/*'
            ],
            filters: {
                'knexfile.js': "database === 'mysql'",
                'tailwind.js.ejs': "ui === 'tailwind'",
                'postcss.config.js': "ui === 'tailwind'",
                'webpack.config.vue.js.ejs': "client === 'vue'",
                '.prettierrc': "features.includes('prettier')",
                '.prettierignore': "features.includes('prettier')",
                'webpack.config.react.js.ejs': "client === 'react'",
                '.eslintrc.json.ejs': "features.includes('linter')",
                'jest.config.vue.js.ejs': "client === 'vue' && test === 'jest'",
                'jest.config.react.js.ejs':
                    "client === 'react' && test === 'jest'"
            }
        })

        const patterns = {
            '.env.ejs': '.env',
            '.babelrc.ejs': '.babelrc',
            'README.md.ejs': 'README.md',
            'package.json.ejs': 'package.json',
            '.env.example.ejs': '.env.example',
            'jest.config.vue.js.ejs': 'jest.config.js',
            'jest.config.react.js.ejs': 'jest.config.js',
            'webpack.config.vue.js.ejs': 'webpack.config.js',
            'webpack.config.react.js.ejs': 'webpack.config.js'
        }

        if (this.answers.test === 'jest') {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: `template/tests/${this.answers.server}-${
                    this.answers.client
                }`
            })

            actions.push({
                type: 'add',
                files: '**',
                templateDir: `template/mocks`
            })
        }

        actions.push({
            type: 'add',
            files: '**',
            templateDir: `template/${this.answers.server}/${
                this.answers.database
            }`
        })

        actions.push({
            type: 'add',
            files: '**',
            templateDir: `template/${this.answers.client}/${this.answers.ui}`
        })

        if (this.answers.test === 'jest') {
            patterns['jest.config.js.ejs'] = 'jest.config.js'
        }

        if (this.answers.features.includes('linter')) {
            patterns['.eslintrc.json.ejs'] = '.eslintrc.json'
        }

        if (this.answers.ui === 'tailwind') {
            patterns['tailwind.js.ejs'] = 'tailwind.js'
        }

        actions.push({
            type: 'move',
            patterns
        })

        if (this.answers.database === 'mysql') {
            actions.push({
                type: 'add',
                files: 'knexfile.js'
            })
        }

        return actions
    },
    templateData() {
        const name = this.answers.name
        const server = this.answers.server
        const client = this.answers.client
        const description = this.answers.description
        const linter = this.answers.features.includes('linter')
        const prettier = this.answers.features.includes('prettier')

        return {
            name,
            server,
            client,
            description,
            jwt: randomstring.generate(48),
            linter: linter ? 'yes' : 'no',
            prettier: prettier ? 'yes' : 'no'
        }
    },
    async completed() {
        // this.gitInit()
        await this.npmInstall({ npmClient: this.answers.pm })
        this.showProjectTips()
    }
}
