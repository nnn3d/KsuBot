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
                    name: 'who',
                    check: {
                        args: /^(кто|кого) (.+)/i,
                        type: 'chat',
                    },
                    userNickname: {
                        prefix: true,
                    },
                    vip: {
                        usages: 6,
                    },
                    messageTemplate: {
                        body2: `#{0} "#{1}" - #{2}`,
                        body1: `#{0}`,
                    },
                    commandList: {
                        name: 'кто или кого',
                        description: 'бот ответит на вопрос "кто", "кого", советуем попробовать "кто я"',
                        usage: 'кто (любое слово или фраза)',
                },
                }, {
                    name: 'chance',
                    check: /^(инфа|вероятность) (.+)/i,
                    userNickname: {
                        prefix: true,
                    },
                    vip: {
                        usages: {
                            dm: 5,
                            chat: 10,
                        },
                    },
                    messageTemplate: `#{0} #{1}%`,
                    commandList: {
                        name: 'вероятность события',
                        description: 'вероятность (или инфа) (любое слово или фраза) - бот скажет вероятность события.',
                        usage: 'инфа (любое слово или фраза)',
                    },
                }, {
                    name: 'online',
                    check: {
                        args: /^онлайн/i,
                        type: 'chat',
                    },
                    vip: {
                        usages: 6,
                    },
                    messageTemplate: {
                        title: `участники беседы, находящиеся онлайн (#{0} из #{1}):`,
                        body: `&#128312; #{0}. #{1} (#{2})`,
                    },
                    commandList: {
                        name: 'онлайн',
                        description: 'показывает кто в данный момоент онлайн',
                    },
                }, {
                    name: 'choose',
                    check: {
                        args: /^выбери (.+ или .+)/i
                    },
                    userNickname: {
                        prefix: true,
                    },
                    vip: {
                        usages: {
                            dm: 3,
                            chat: 6,
                        },
                    },
                    messageTemplate: {
                        title: 'я выбираю "#{0}"!',
                    },
                    commandList: {
                        name: 'выбор между',
                        usage: 'выбери (что-то) или (что-то) {или (что-то)}...',
                        description: 'выбирает случайный из предложенных вариантов',
                    },
                },
            ].concat(this.yandexToken ? [
                {
                    name: 'translate',
                    check: {
                        args: /^перев[ео]ди? ((?:.|\n)+)/i
                    },
                    userNickname: {
                        prefix: true,
                    },
                    vip: {
                        usages: {
                            dm: 3,
                            chat: 6,
                        },
                    },
                    messageTemplate: {
                        title: 'перевод: #{0}',
                    },
                    commandList: {
                        name: 'перевод',
                        usage: 'перевод (любой текст)',
                        description: 'переводит текст на русский или английский в зависимости от запроса',
                    },
                },
            ] : []),
        }
    }

    _init(bot) {
        return super._init(bot).then(pf.allAsync([
            this.bot.middlewareOn('Lists.getAutoLists', this._getAutoLists, this),
        ]))
    }

    _final() {
        return super._final().then(pf.allAsync([
            this.bot.removeMiddlewareOnByHandler('Lists.getAutoLists', this),
        ]))
    }

    _getAutoLists([chat, lists]) {
        if (!chat.modules.includes(this)) return;
        let autoList = {
            name: 'онлайн',
            description: 'состовляет список из участников чата, находящихся онлайн',
            check: /^онлайн$/,
            getUsers: (chat) => this.bot.vk.api.users.get({
                user_ids: chat.users.join(','),
                fields: 'online',
            }).then(users => users.filter(user => user.online).map(user => user.id)),
        };
        lists.push(autoList);
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    who(chat, message, command) {
        let info = command.check.args.exec(message.getCommandArgs().join(' '));
        let frases = ["Я думаю, что","Очевидно, что","ИМХО","Ну тут все ясно,","Ничего личного, но","Звезды говорят,","Скажу прямо,"];
        if ((info[2]==='я') || (info[2]==='Я')){
            let a_sector = ["пират", "киборг", "алкаш", "урод", "повелитель", "жирдяй", "админ", "пенсионер", "ассасин", "владыка", "лицушник", "сталкер", "разработчик", "паркурщик", "спринтер", "задротище", "довакин", "опустошитель", "бурят", "шалава", "высер", "ингушет", "анал", "овощ", "гусь", "анимешник", "зашквар", "дупло", "слюна", "крот", "делфьин", "капибара", "псина", "коза", "локоть", "голень"];
            let b_sector = ["карательных", "избирательных", "уродливых", "домашних", "четких", "святых", "школьных", "предвзятых", "овощных", "шальных", "игривых", "кричащих", "быстрых", "аномальных", "страшных", "тупых", "консольных", "черных", "вопиющих", "всратых", "анальных", "слюнявых", "больных", "бурятских", "ссаных", "ограниченных", "слитых", "степных", "козьих"];
            let c_sector = ["тамплиеров", "сисек", "детей", "ведьмаков", "распродаж", "игр", "школьников", "девчат", "драконов", "некроморфов", "зомби", "сиджеев", "азиатов", "американцев", "старцев", "потомков", "магов", "гоблинов", "призраков", "анусов", "шмар", "шлюх", "бурят", "ингушетиков", "сракотанов", "ебасосин", "козочек", "грудничков", "капибар", "конф"];
            let outtext = `${frases[Math.floor( Math.random() * frases.length)]} ты ${a_sector[Math.floor( Math.random() * a_sector.length )]} ${b_sector[Math.floor( Math.random() * b_sector.length )]} ${c_sector[Math.floor( Math.random() * c_sector.length )]}`;
            return message.createReply()
                .setBodyTemplate(command.messageTemplate.body1,
                    outtext)
                .send();
        }
        let users = chat.users.slice();
            let user = users[Math.floor( Math.random() * users.length )];
            message.createReply()
                .setBodyTemplate(command.messageTemplate.body2,
                    `${frases[Math.floor( Math.random() * frases.length)]}`,
                    info[2],
                    `[id${user}|${chat.userNames[user].fullName}]`)
                .send();
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    chance(chat, message, command) {
        let info = command.check.exec(message.getCommandText());
        let frases = ["Здезды говорят, что вероятность -","Ровно","Мама говорит, что это","Примерно","Ух, считать устала! Вроде ","Хуероятность","Скажу прямо","17e^3pi/-e%*6,0(3)... Я тут прикинула"];
        let chanceval = Math.round(Math.random() * 100);
        return message.createReply()
            .setBodyTemplate(command.messageTemplate,
                `${frases[Math.floor( Math.random() * frases.length)]}`, chanceval)
            .send();
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    online(chat, message, command) {
        let onlineUsers = [];
        let appIds = new Set();
        let result = Promise.resolve();
        const platforms = {
            1: 'Браузер',
            2: 'iPhone',
            3: 'iPad',
            4: 'Android',
            5: 'Windows Phone',
            6: 'Windows',
            7: 'Браузер',
            8: 'VK Mobile',
        };
        return this.bot.vk.api.users.get({
            user_ids: chat.users.join(','),
            fields: ['online', 'last_seen'].join(','),
        }).then(users => {
            for (let user of users) {
                if (user.online === 1) {
                    let userInfo = {
                        name: chat.userNames[user.id].fullName,
                        platform: platforms[user.last_seen.platform] || '',
                        appId: +user.online_app || null,
                    };
                    if (user.online_app) appIds.add(user.online_app);
                    onlineUsers.push(userInfo);
                }
            }
            if (appIds.size) result = this.bot.vk.api.apps.get({
                app_ids: Array.from(appIds).join(','),
            }).then(({ items }) => {
                for (let app of items) {
                    if (!app.title) continue;
                    onlineUsers
                        .filter(user => user.appId === app.id)
                        .map(user => user.platform = app.title);
                }
            });
            return result
                .then(
                    () => message
                        .setTitleTemplate(
                            command.messageTemplate.title,
                            onlineUsers.length,
                            chat.users.length
                        )
                        .setBodyTemplate(
                            command.messageTemplate.body,
                            n => n+1,
                            n => onlineUsers[n].name,
                            n => onlineUsers[n].platform
                        )
                        .setTemplateLength(onlineUsers.length)
                        .send()
                )
        });
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    choose(chat, message, command) {
        let info = command.check.args.exec(message.getCommandText())[1];
        let chooses = info.split(' или ');
        let choose = chooses[Math.floor(Math.random() * chooses.length)];
        return message.setTitleTemplate(command.messageTemplate.title, choose).send();
    }

    /**
     *
     * @param {Chat} chat
     * @param {Message} message
     * @param {SpecificationCommand} command
     */
    translate(chat, message, command) {
        let text = command.check.args.exec(message.getCommandText())[1];
        let en, ru;
        en = ru = 0;
        let exp = /([a-zа-яё])/ig;
        let res;
        while ((res = exp.exec(text)) !== null) {
            if (/[a-z]/i.test(res[1])) en++;
            else ru++;
        }
        let params = {
            url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
            qs: {
                text,
                key: this.yandexToken,
                lang: en > ru ? 'ru' : 'en',
            },
        };
        return pf.callbackToPromise(request.get.bind(request), params)
            .then(([err, res, body]) => {
                let text = body && JSON.parse(body).text[0] || '';
                text = text.replace('.', '');
                return message.setTitleTemplate(command.messageTemplate.title, text).send();
            })
    }
};