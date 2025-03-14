const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const router = express.Router();
const rateLimiter = require('./directives/rateLimiterDirective');
const MongroDriver = require('./directives/mongo');
const UtilityService = require('./services/utility.service');
const genericRouter = require('./routes/genericRouter');
const smtpMail = require('./services/mail.service');
const app = express();
let redirectRef = {};
class Main {
    constructor() {
        this.mongodb = new MongroDriver();
        this.utility = new UtilityService();
        this.init();
    }
    init() {
        this.routerInitialization()
    }
    async routerInitialization() {
        this.initializeMiddlewares();
        this.routerRecursive(genericRouter);
        app.use('/', rateLimiter);

        app.use('/', router);
        this.appListen();
    }
    initializeMiddlewares() {
        app.use(cors());
        app.use(helmet());
        app.use(express.json({ limit: '5mb' }));
    }
    routerRecursive(genericRouter, urlpath = '') {
        for (const item of genericRouter) {
            let newPath = (urlpath + '/' + item['path']).replace(/\/\//g, '/');
            if ((item['controller'] && item['action']) || item['redirectTo']) {
                if (item['redirectTo']) {
                    redirectRef[newPath] = item['redirectTo'];
                    app.use(newPath, (req, res, next) => {
                        req.url = '/' + item['redirectTo'];
                        res.redirect(307, req.url);
                        next();
                    });
                }
                else this.routerActionSelection(item, newPath);
            }

            if (item.rateLimit) {
                this.app.use(newPath, rateLimiter);
            }

            if (item['children']) {
                this.routerRecursive(item['children'], newPath);
            }
        }

    }
    routerActionSelection(item, routerPath = '') {
        if (item['redirectTo'] || redirectRef[routerPath]) return;
        let controllerAction = (req, res) => {
            const scopeObject = {
                req, res,
                db:this.mongodb,
                utility:this.utility,
                smtpMail:smtpMail
            };
            const controller = new item['controller'](scopeObject);
            controller[item['action']]();

        }
        const currentType = '' + (item['type'] || '').toLowerCase();
        switch (currentType) {
            case "get": {
                router.get(routerPath, (req, res) => { controllerAction(req, res); });
                break;
            } case "post": {
                router.post(routerPath, (req, res) => { controllerAction(req, res); });
                break;
            } case "put": {
                router.put(routerPath, (req, res) => { controllerAction(req, res); });
                break;
            } default: {
                try {
                    router.get(routerPath, (req, res) => {
                        res.status(403).send('');
                        res.end();
                    });
                } catch (e) { };

            }
        }
    }

    appListen() {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}

let start = new Main();



