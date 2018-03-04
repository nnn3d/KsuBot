'use strict';

const ModuleEventController = require('../../classes/base/ModuleEventController');
const pf = require('../../helpers/promiseFactory');
const request = require('request');

module.exports = class Info extends ModuleEventController {

    constructor({
                    yandexToken
                } = {}) {
        super();
        if (!yandexToken) console.log('has no yandex token for module Info command Translate');
        this.yandexToken = yandexToken;
    }

    /**
     * @returns {Specification}
     */
    moduleSpecification() {
        return {
            commandList: {
                name: 'Инфо',
                description: 'Отвечает на вопросы, показывает вероятности и онлайн',
            },
            commands: [
                {
                    name: 'test',
                    check: {
                        args: /^тест (.+)/i,
                        type: 'chat',
                    },
                    messageTemplate: {
                        title: 'тестовый титл рандом #{0}',
                        body: '#{0} буква - #{1}'
                    },
                    commandList: {
                        name: 'тестовая команда',
                        description: 'выполняет тестовую команду',
                        usage: 'тест',
                    },
                },
            ]
        }
    }

    _init(bot) {
        // возвращать промис во всех init, final, chatInit, ... - почти всегда обязательно, иначе бот запустится (или чат создастся) до того, как это все выполнится
        return super._init(bot) // родитель подписывается глобально подписывается на инит чата, вызывая для каждого чата _initChat, а так же присваивает бота в this.bot
            .then(() => {
                // выполняется перед использованием, 1 раз до final, тут подписываемся на глобальные события чего угодно, делаем какие то начальные настройки
            })
    }

    _final() {
        return super._final() // отписывается от того, на что подписался super._init
            .then(() => {
                // тут отписываемся от всего, что делали в _init, завершаем какие-то процессы и т.д.
            });
    }

    stop() {
        // тут можно что то делать, перед выключением бота (_final перед выключением НЕ вызывается), тоже возвращаем промис
    }

    _initChat(chat) {
        return super._initChat(chat) // подписывается на сообщения, выполняя команды из specification
            .then(() => {
                // тут локильно подписываемся на эвенты чата
            })
    }

    _finalChat(chat) {
        return super._finalChat(chat) // отписывается от всего, на что подписался super._initChat
            .then(() => {
                // тут локально отписываемся от всякого хлама и т.д.
            })
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    test(chat, message, command) {
        let symbols = message.getCommandText().split('');
        // возвращаем промис, по этому команда завершится только тогда, когда сообщение отправится
        return message
            .setTitleTemplate(command.messageTemplate.title, Math.random()) // методы чайнятся, возвращают this, делаем один за другим
            .setBodyTemplate( // в отличие от title и end, добавляет к сообщению много строк
                command.messageTemplate.body, // первым темплейт, далее аргументы, будут заменять #{n}, где n - номер аргумента, начиная с 0
                (n) => n + 1, // можно кидать функции, заменит #{0}, n - номер строки (с 0)
                symbols // если кидаешь массив, берет из него n элемент
            )
            .setTemplateLength(symbols.length) // задаем длину для body темплейта
            .setEnd('сообщение отправлено от: #{0}', message.user) // можно и так
            .send() // отправляем, возвращает промис, а не this
            .then(id => console.log('id отправленного сообщения - ', id))
    }
}
