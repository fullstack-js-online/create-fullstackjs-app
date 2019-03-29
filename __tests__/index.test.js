const sao = require('sao')
const path = require('path')
const generator = path.join(__dirname, '..')

const defaultPromptAnswers = {
    server: 'express',
    database: 'mongodb',
    features: ['prettier', 'linter'],
    pm: 'yarn',
    client: 'react',
    test: 'jest'
}

test('reactjs', async () => {
    const mockPromptAnswers = Object.assign({}, defaultPromptAnswers, { client: 'react' })

    const stream = await sao.mock({ generator }, mockPromptAnswers)

    expect(stream.fileList).toMatchSnapshot()
})

test('vue js', async () => {
    const mockPromptAnswers = Object.assign({}, defaultPromptAnswers, { client: 'vue' })

    const stream = await sao.mock({ generator }, mockPromptAnswers)

    expect(stream.fileList).toMatchSnapshot()
})

test('mysql', async () => {
    const mockPromptAnswers = Object.assign({}, defaultPromptAnswers, { database: 'mysql' })

    const stream = await sao.mock({ generator }, mockPromptAnswers)

    expect(stream.fileList).toMatchSnapshot()
})
